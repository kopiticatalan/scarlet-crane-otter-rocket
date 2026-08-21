#!/usr/bin/env python3
"""
Bombay HC Matter Tracker — v4.0
--------------------------------
A local app (pure Python standard library) that:
  - lets you add a Bombay High Court case,
  - downloads all its orders/judgments into
        ~/Desktop/Bombay HC matters/<Petitioner v Respondent>/
  - keeps a persistent "matter list" with hearing notes and tasks,
  - re-downloads only NEW orders on Refresh,
  - scans the next N days of causelists for your matters and watched firms,
  - exports hearing dates to Apple Calendar (.ics),
  - posts macOS notifications when your matters are listed.

v3.0: the UI now opens in a native WebKit (WKWebView) window — no Chrome.
The server runs on 127.0.0.1 and keeps scanning in the background even
after you close the window (close = hide, Quit in Settings = full quit).
No third-party packages required.
"""

import os, re, ssl, sys, json, html, zlib, time, datetime, threading, subprocess
import urllib.request, urllib.parse, http.cookiejar
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from concurrent.futures import ThreadPoolExecutor

# --------------------------------------------------------------------------
# Paths / storage
# --------------------------------------------------------------------------
HOME = os.path.expanduser("~")
DESKTOP = os.path.join(HOME, "Desktop")
if not os.path.isdir(DESKTOP):
    DESKTOP = HOME  # fallback if Desktop is relocated
BASE_DIR = os.path.join(DESKTOP, "Bombay HC matters")
SUPPORT_DIR = os.path.join(HOME, "Library", "Application Support", "BombayHCMatterTracker")
STORE = os.path.join(SUPPORT_DIR, "matters.json")
LISTINGS = os.path.join(SUPPORT_DIR, "listings.json")
SETTINGS = os.path.join(SUPPORT_DIR, "settings.json")
CAUSELIST_DIR = os.path.join(SUPPORT_DIR, "causelists")
EXPORT_DIR = os.path.join(SUPPORT_DIR, "exports")
UI_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
_LOCK = threading.RLock()

VERSION = "4.0"
HOST, PORT = "127.0.0.1", 8765
SITE = "https://bombayhighcourt.gov.in"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Version/17.4 Safari/605.1.15")

SIDE_LABEL = {"1": "AS", "2": "OS"}
STAMPREG_LABEL = {"R": "Register", "S": "Stamp"}

DEFAULT_SETTINGS = {
    "watched": ["Bharucha & Partners", "Advani & Co.", "Advani Law LLP"],
    "scan_days": 5,
    "notify": True,
}


def ensure_dirs():
    for d in (BASE_DIR, SUPPORT_DIR, CAUSELIST_DIR, EXPORT_DIR):
        os.makedirs(d, exist_ok=True)


def _load_json(path, fallback):
    with _LOCK:
        if not os.path.exists(path):
            return fallback
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return fallback


def _save_json(path, data):
    with _LOCK:
        ensure_dirs()
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        os.replace(tmp, path)


def _normalize_matter(m):
    m.setdefault("hearing_notes", [])
    m.setdefault("next_steps", [])
    m.setdefault("partner", "")
    m.setdefault("associates", "")
    m.setdefault("next_hearing", "")
    normalized_steps = []
    for s in m["next_steps"]:
        # Early builds stored a plain string for a step.  Preserve it when a
        # user opens the new dashboard, instead of silently losing the text.
        if isinstance(s, str):
            s = {"text": s, "done": False, "due": ""}
        if isinstance(s, dict):
            s.setdefault("text", "")
            s.setdefault("done", False)
            s.setdefault("due", "")
            normalized_steps.append(s)
    m["next_steps"] = normalized_steps
    return m


def load_matters():
    return [_normalize_matter(m) for m in _load_json(STORE, [])]


def save_matters(matters):
    _save_json(STORE, matters)


def load_settings():
    s = dict(DEFAULT_SETTINGS)
    s.update(_load_json(SETTINGS, {}))
    if not isinstance(s.get("watched"), list):
        s["watched"] = list(DEFAULT_SETTINGS["watched"])
    try:
        s["scan_days"] = max(1, min(14, int(s.get("scan_days", 5))))
    except Exception:
        s["scan_days"] = 5
    s["notify"] = bool(s.get("notify", True))
    return s


def save_settings(s):
    _save_json(SETTINGS, s)


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def strip_tags(s):
    return re.sub(r"<[^>]+>", " ", s or "")


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(s or "")).strip()


def sanitize(s, maxlen=120):
    s = re.sub(r'[\\/:*?"<>|]', "", s or "")
    s = re.sub(r"\s+", " ", s).strip().rstrip(".")
    return s[:maxlen].strip()


def short(s, n=55):
    s = (s or "").strip()
    return s[:n].strip() if len(s) > n else s


def extract_input_value(page, name):
    # Handles attribute order: name before value or value before name.
    m = re.search(r'<input[^>]*\bname="%s"[^>]*\bvalue="([^"]*)"' % re.escape(name), page, re.I)
    if m:
        return m.group(1)
    m = re.search(r'<input[^>]*\bvalue="([^"]*)"[^>]*\bname="%s"' % re.escape(name), page, re.I)
    return m.group(1) if m else ""


def notify_mac(title, text):
    """Post a macOS notification (best-effort, honours the notify setting)."""
    try:
        if not load_settings().get("notify", True):
            return
        if sys.platform != "darwin":
            return
        t = (title or "").replace("\\", " ").replace('"', "'")
        x = (text or "").replace("\\", " ").replace('"', "'")
        subprocess.Popen(
            ["osascript", "-e", 'display notification "%s" with title "%s"' % (x, t)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass


def open_in_finder(path):
    if sys.platform == "darwin":
        # Do not hand court PDFs to the user's default browser.  Preview is
        # faster, local, and keeps this app entirely independent of Chrome.
        lower = (path or "").lower()
        if lower.endswith(".pdf"):
            subprocess.run(["open", "-a", "Preview", path])
        elif lower.endswith(".ics"):
            subprocess.run(["open", "-a", "Calendar", path])
        else:
            subprocess.run(["open", path])


# --------------------------------------------------------------------------
# Court client
# --------------------------------------------------------------------------
def make_opener():
    cj = http.cookiejar.CookieJar()
    ctx = ssl._create_unverified_context()
    try:
        ctx.options |= getattr(ssl, "OP_LEGACY_SERVER_CONNECT", 0)
    except Exception:
        pass
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        urllib.request.HTTPSHandler(context=ctx),
    )
    opener.addheaders = [("User-Agent", UA), ("Accept", "*/*")]
    return opener


def get_case_types(side):
    opener = make_opener()
    url = SITE + "/bhc/get-case-types-by-side?side=" + urllib.parse.quote(str(side))
    req = urllib.request.Request(url, headers={"X-Requested-With": "XMLHttpRequest"})
    with opener.open(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8", "replace"))
    out = []
    for t in data if isinstance(data, list) else []:
        if not t or not t.get("case_type"):
            continue
        name = t.get("type_name") or ""
        full = t.get("full_form") or name
        out.append({"value": str(t["case_type"]),
                    "label": (name + " - " + full) if name else full})
    out.sort(key=lambda x: x["label"])
    return out


def search_case(params):
    """params: side, stampreg, case_type, case_no, year. Returns dict or None."""
    opener = make_opener()
    page_url = SITE + "/bhc/casestatus/casenumber"
    with opener.open(urllib.request.Request(page_url), timeout=30) as r:
        page = r.read().decode("utf-8", "replace")
    token = extract_input_value(page, "_token")
    secret = extract_input_value(page, "form_secret")
    if not token:
        raise RuntimeError("Could not obtain a session token from the court site.")

    body = urllib.parse.urlencode({
        "_token": token, "form_secret": secret,
        "side": params["side"], "stampreg": params["stampreg"],
        "case_type": params["case_type"], "case_no": params["case_no"],
        "year": params["year"],
    }).encode()
    req = urllib.request.Request(page_url, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
    req.add_header("X-Requested-With", "XMLHttpRequest")
    req.add_header("Referer", page_url)
    with opener.open(req, timeout=60) as r:
        raw = r.read().decode("utf-8", "replace")
    try:
        j = json.loads(raw)
    except Exception:
        return None
    if not j.get("status") or not j.get("page"):
        return None

    page_html = j["page"]
    petitioner, respondent = extract_parties(page_html)
    orders = extract_orders(page_html)
    meta = extract_meta(page_html)
    meta["next_listing"] = extract_label_date(page_html, "Next Listing Date")
    return {"opener": opener, "petitioner": petitioner, "respondent": respondent,
            "orders": orders, "meta": meta}


def extract_parties(page):
    text = clean(strip_tags(page))
    m = re.search(r"\bby\s+(.+?)\s+against\s+(.+?)"
                  r"(?:\s+Filing Number|\s+Registration Date|\s+Next Listing|\s+Disposal|\.\s|$)",
                  text, re.I)
    if m:
        return clean(m.group(1)), clean(m.group(2))
    return "", ""


def extract_meta(page):
    text = clean(strip_tags(page))
    cnr = re.search(r"\b(HCBM\w+)\b", text)
    filed = re.search(r"filed on\s+(\d{2}/\d{2}/\d{4})", text, re.I)
    return {"cnr": cnr.group(1) if cnr else "",
            "filed_on": filed.group(1) if filed else ""}


ORDER_HREF = re.compile(
    r'href="([^"]*(?:file/download|order-pdf|casestatus/order)[^"]*)"', re.I)

def extract_orders(page):
    idx = -1
    for needle in ("View Document", "order-pdf", "file/download", "casestatus/order"):
        idx = page.find(needle)
        if idx >= 0:
            break
    if idx < 0:
        return []
    start = page.rfind("<table", 0, idx)
    end = page.find("</table>", idx)
    table = page[start:end] if (start >= 0 and end >= 0) else page

    orders = []
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", table, re.S | re.I):
        href = ORDER_HREF.search(row)
        if not href:
            continue
        cells = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S | re.I)
        texts = [clean(strip_tags(c)) for c in cells]
        srl = texts[0] if texts else ""
        date = ""
        for t in texts:
            m = re.search(r"\d{2}/\d{2}/\d{4}", t)
            if m:
                date = m.group(0)
                break
        doc = texts[3] if len(texts) >= 4 else ""
        coram = texts[1] if len(texts) >= 2 else ""
        orders.append({"srl": srl, "date": date, "doc": doc, "coram": coram,
                       "href": html.unescape(href.group(1))})
    return orders


def newest_order(orders):
    return max(orders, key=_date_sort_key) if orders else None


def extract_label_date(page, label):
    """Value (a date) shown immediately after a label like 'Next Listing Date'."""
    text = clean(strip_tags(page))
    m = re.search(re.escape(label) + r"\s*(\d{2}/\d{2}/\d{4})", text, re.I)
    return m.group(1) if m else ""


def order_key(o):
    """Stable identifier for an order (download tokens change every request)."""
    return (o.get("date", "") + "|" + (o.get("doc", "") or "")).strip("|")


def abs_court_url(href):
    href = html.unescape(href or "")
    if href.startswith("http"):
        return href
    return urllib.parse.urljoin(SITE + "/", href.lstrip("/"))


def download_pdf(opener, url, dest):
    url = abs_court_url(url)
    req = urllib.request.Request(url, headers={
        "X-Requested-With": "XMLHttpRequest",
        "Referer": SITE + "/",
    })
    with opener.open(req, timeout=90) as r:
        data = r.read()
    if not data[:5] == b"%PDF-":
        return False
    with open(dest, "wb") as f:
        f.write(data)
    return True


# --------------------------------------------------------------------------
# Core actions
# --------------------------------------------------------------------------
def matter_folder(petitioner, respondent):
    name = sanitize(short(petitioner) + " v " + short(respondent)) or "Unknown Case"
    return os.path.join(BASE_DIR, name)


def _date_sort_key(o):
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", o.get("date") or "")
    return (int(m.group(3)), int(m.group(2)), int(m.group(1))) if m else (0, 0, 0)


def do_download(result, folder, downloaded_keys):
    """Download orders whose key isn't already known. Returns (added, skipped_dates).

    Files are numbered with 1 = oldest order, so the folder sorts oldest->latest.
    Because new hearings are always newer than what's already saved, a new order
    gets the next-highest number and existing files keep their numbers.
    """
    os.makedirs(folder, exist_ok=True)
    pet = short(sanitize(result["petitioner"] or "Petitioner"))
    resp = short(sanitize(result["respondent"] or "Respondent"))
    ordered = sorted(result["orders"], key=_date_sort_key)  # oldest -> newest
    added, skipped = 0, []
    known = set(downloaded_keys)
    for i, o in enumerate(ordered):
        key = order_key(o)
        seq = i + 1
        ddmmyyyy = (o.get("date") or "").replace("/", "")
        # Each filename carries a unique sequence number, so it identifies the
        # order on disk. Download whenever the file is missing (covers new orders
        # AND any orders the user has deleted from the folder).
        fname = sanitize(f"{seq} {ddmmyyyy} {pet} v {resp}") + ".pdf"
        dest = os.path.join(folder, fname)
        if os.path.exists(dest):
            if key not in known:
                known.add(key)
                downloaded_keys.append(key)
            continue
        try:
            if download_pdf(result["opener"], o["href"], dest):
                added += 1
                if key not in known:
                    known.add(key)
                    downloaded_keys.append(key)
            else:
                skipped.append(o.get("date") or "?")
        except Exception:
            skipped.append(o.get("date") or "?")
    return added, skipped


def add_matter(params):
    result = search_case(params)
    if result is None:
        raise RuntimeError("No case found for those details. Re-check Side / Stamp-vs-Register / Type.")
    folder = matter_folder(result["petitioner"], result["respondent"])
    downloaded_keys = []
    added, skipped = do_download(result, folder, downloaded_keys)

    newest = newest_order(result["orders"])
    matters = load_matters()
    mid = "|".join([params["side"], params["stampreg"], params["case_type"],
                    params["case_no"], params["year"]])
    matter = {
        "id": mid,
        "side": params["side"], "side_label": SIDE_LABEL.get(params["side"], params["side"]),
        "stampreg": params["stampreg"], "stampreg_label": STAMPREG_LABEL.get(params["stampreg"], params["stampreg"]),
        "case_type": params["case_type"], "type_name": params.get("type_name", ""),
        "case_no": params["case_no"], "year": params["year"],
        "petitioner": result["petitioner"], "respondent": result["respondent"],
        "cnr": result["meta"].get("cnr", ""), "filed_on": result["meta"].get("filed_on", ""),
        # Manual fields (entered by you via the details panel):
        "partner": "", "associates": "", "next_hearing": "",
        "hearing_notes": [], "next_steps": [],
        # Pulled from the website / orders:
        "last_listing": newest["date"] if newest else "",
        "last_coram": newest["coram"] if newest else "",
        "next_listing": result["meta"].get("next_listing", ""),
        "folder": folder, "order_count": len(result["orders"]),
        "downloaded_keys": downloaded_keys,
        "added_at": time.strftime("%Y-%m-%d %H:%M"),
        "last_refresh": time.strftime("%Y-%m-%d %H:%M"),
        "last_added": added,
    }
    # replace if same id exists, but keep the old manual fields
    old = next((m for m in matters if m.get("id") == mid), None)
    if old:
        for k in ("partner", "associates", "next_hearing", "hearing_notes", "next_steps"):
            matter[k] = old.get(k, matter[k])
    matters = [m for m in matters if m.get("id") != mid]
    matters.append(matter)
    save_matters(matters)
    return {"matter": matter, "added": added, "skipped": skipped}


def refresh_matter(mid):
    matters = load_matters()
    matter = next((m for m in matters if m.get("id") == mid), None)
    if not matter:
        raise RuntimeError("Matter not found.")
    params = {"side": matter["side"], "stampreg": matter["stampreg"],
              "case_type": matter["case_type"], "case_no": matter["case_no"],
              "year": matter["year"]}
    result = search_case(params)
    if result is None:
        raise RuntimeError("Could not re-fetch the case from the court site.")
    folder = matter.get("folder") or matter_folder(result["petitioner"], result["respondent"])
    # keep parties fresh
    matter["petitioner"] = result["petitioner"] or matter["petitioner"]
    matter["respondent"] = result["respondent"] or matter["respondent"]
    downloaded_keys = matter.get("downloaded_keys", [])
    added, skipped = do_download(result, folder, downloaded_keys)
    newest = newest_order(result["orders"])
    matter["downloaded_keys"] = downloaded_keys
    matter["order_count"] = len(result["orders"])
    matter["folder"] = folder
    matter["last_refresh"] = time.strftime("%Y-%m-%d %H:%M")
    matter["last_added"] = added
    matter["last_listing"] = newest["date"] if newest else matter.get("last_listing", "")
    matter["last_coram"] = newest["coram"] if newest else matter.get("last_coram", "")
    matter["next_listing"] = result["meta"].get("next_listing", "") or matter.get("next_listing", "")
    if result["meta"].get("cnr"):
        matter["cnr"] = result["meta"]["cnr"]
    save_matters(matters)
    return {"matter": matter, "added": added, "skipped": skipped}


def refresh_all():
    matters = load_matters()
    added_total, results = 0, []
    for m in list(matters):
        try:
            r = refresh_matter(m["id"])
            added_total += r["added"]
            results.append({"id": m["id"], "added": r["added"]})
        except Exception as e:
            results.append({"id": m["id"], "error": str(e)})
    if added_total:
        notify_mac("Bombay HC Matter Tracker",
                   "%d new order%s downloaded." % (added_total, "" if added_total == 1 else "s"))
    return {"added_total": added_total, "count": len(matters), "results": results}


def update_matter(mid, fields):
    matters = load_matters()
    m = next((x for x in matters if x.get("id") == mid), None)
    if not m:
        raise RuntimeError("Matter not found.")
    for k in ("partner", "associates", "next_hearing"):
        if k in fields and isinstance(fields[k], str):
            m[k] = fields[k].strip()
    for k in ("hearing_notes", "next_steps"):
        if k in fields and isinstance(fields[k], list):
            m[k] = fields[k]
    save_matters(matters)
    return {"matter": _normalize_matter(m)}


def remove_matter(mid):
    matters = load_matters()
    matters = [m for m in matters if m.get("id") != mid]
    save_matters(matters)
    return {"ok": True}


def open_folder(mid):
    matters = load_matters()
    matter = next((m for m in matters if m.get("id") == mid), None)
    path = matter.get("folder") if matter else BASE_DIR
    if path and os.path.isdir(path):
        open_in_finder(path)
        return {"ok": True}
    open_in_finder(BASE_DIR)
    return {"ok": True, "note": "Opened base folder"}


# --------------------------------------------------------------------------
# Watched advocate firms (configurable in Settings)
# --------------------------------------------------------------------------
def _firm_regex(name):
    """Flexible matcher: '&'/'and' optional, commas/periods tolerated,
    'Co' also matches 'Company'."""
    tokens = re.findall(r"[A-Za-z]+", name or "")
    parts = []
    for t in tokens:
        tl = t.lower()
        if tl in ("and",):
            continue
        if tl in ("co", "company"):
            parts.append(r"(?:co|company)\b")
        else:
            parts.append(re.escape(tl))
    if not parts:
        return None
    return re.compile(r"[\s,.]*(?:&|and)?[\s,.]*".join(parts), re.I)


def adv_patterns():
    pats = []
    for name in load_settings().get("watched", []):
        rx = _firm_regex(name)
        if rx:
            pats.append((name.strip(), rx))
    return pats


def match_advocates(text, pats):
    return [name for name, rx in pats if rx.search(text)]


# --------------------------------------------------------------------------
# Causelist (listing visibility)
# --------------------------------------------------------------------------
MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]


def load_listings():
    return _load_json(LISTINGS, {"rows": [], "date": "", "date_pretty": "",
                                 "scanned_at": "", "judges": 0})


def save_listings(d):
    _save_json(LISTINGS, d)


def matter_casenos(m):
    """Causelist case-number token(s) for a matter. Stamp/lodging numbers appear
    in causelists with an '(L)' suffix, e.g. CARBA(L)/15/2026."""
    tn = m.get("type_name", "") or ""
    abbr = tn.split(" - ")[0].strip() if tn else ""
    no, yr = m.get("case_no"), m.get("year")
    if not abbr or not no or not yr:
        return []
    if m.get("stampreg") == "S":
        return [f"{abbr}(L)/{no}/{yr}"]
    return [f"{abbr}/{no}/{yr}"]


def annotate_listings(d):
    """Recompute each row's tracked/add/name against the CURRENT matters, so the
    '+ Add to my cases' button reflects adds and deletes without a re-scan."""
    matters = load_matters()
    by_caseno = {}
    for m in matters:
        for cn in matter_casenos(m):
            by_caseno[cn.upper()] = m
    for row in d.get("rows", []):
        num = (row.get("number") or "").upper()
        m = by_caseno.get(num)
        reasons = [r for r in row.get("reasons", []) if r != "Your matter"]
        if m:
            row["tracked"] = True
            row["add"] = None
            row["reasons"] = ["Your matter"] + reasons
            row["mid"] = m.get("id")
            name = (short(m.get("petitioner") or "") + " v " + short(m.get("respondent") or "")).strip(" v")
            if name:
                row["matter"] = name
        else:
            row["tracked"] = False
            row["mid"] = None
            row["reasons"] = reasons
            if not row.get("add"):
                mm = re.match(r"([A-Z]+)(\(L\))?/(\d+)/(\d{4})", row.get("number", ""))
                if mm:
                    row["add"] = {"abbr": mm.group(1), "stampreg": "S" if mm.group(2) else "R",
                                  "no": mm.group(3), "year": mm.group(4)}
    return d


def _inflate(raw):
    for wbits in (15, -15, 47):
        try:
            d = zlib.decompressobj(wbits)
            out = d.decompress(raw) + d.flush()
            if out:
                return out
        except Exception:
            continue
    return None


def _pdf_extract_ops(b):
    """Pull text out of a decoded PDF content stream (text-showing operators)."""
    s = b.decode("latin1")
    res = []
    i, L = 0, len(s)
    while i < L:
        c = s[i]
        if c == "(":
            j = i + 1
            depth = 1
            buf = []
            while j < L and depth > 0:
                d = s[j]
                if d == "\\":
                    n = s[j + 1] if j + 1 < L else ""
                    if n == "n":
                        buf.append("\n")
                    elif n == "r":
                        pass
                    elif n == "t":
                        buf.append(" ")
                    elif n and n in "01234567":
                        o = n
                        k = j + 2
                        while k < L and s[k] in "01234567" and len(o) < 3:
                            o += s[k]
                            k += 1
                        buf.append(chr(int(o, 8) & 0xFF))
                        j = k
                        continue
                    else:
                        buf.append(n)
                    j += 2
                    continue
                if d == "(":
                    depth += 1
                    buf.append(d)
                    j += 1
                elif d == ")":
                    depth -= 1
                    if depth > 0:
                        buf.append(d)
                    j += 1
                else:
                    buf.append(d)
                    j += 1
            res.append("".join(buf))
            i = j
            continue
        if s.startswith("Td", i) or s.startswith("TD", i) or s.startswith("T*", i):
            res.append("\n")
            i += 2
            continue
        i += 1
    return "".join(res)


def pdf_text(data):
    """Extract text from a (FlateDecode) PDF using only the standard library."""
    out = []
    i = 0
    while True:
        s = data.find(b"stream", i)
        if s < 0:
            break
        j = s + 6
        if data[j:j + 2] == b"\r\n":
            j += 2
        elif data[j:j + 1] in (b"\n", b"\r"):
            j += 1
        e = data.find(b"endstream", j)
        if e < 0:
            break
        raw = data[j:e]
        i = e + 9
        dec = _inflate(raw)
        if dec is None:
            continue
        if b"Tj" not in dec and b"TJ" not in dec:
            continue
        try:
            out.append(_pdf_extract_ops(dec))
        except Exception:
            pass
    return "".join(out).replace("\x00", "")


def parse_causelist_judges(page):
    """From the get-data HTML, list each judge row with its causelist links."""
    judges = []
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", page, re.S | re.I):
        if "file/download" not in row and "order-pdf" not in row:
            continue
        cells = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S | re.I)
        judge = clean(strip_tags(cells[0])) if cells else ""
        links = []
        for href, inner in re.findall(r'href="([^"]*(?:file/download|order-pdf)[^"]*)"[^>]*>(.*?)</a>', row, re.S | re.I):
            label = clean(strip_tags(inner)) or "Causelist"
            links.append({"href": html.unescape(href), "label": label})
        if judge and links:
            judges.append({"judge": judge, "links": links})
    return judges


CASE_TOKEN = r"[A-Z]{2,8}(?:\([A-Z]+\))?/\d+/\d{4}"
LEAD_RE = re.compile(r"(\d+)\s+(" + CASE_TOKEN + r")")
CONN_RE = re.compile(r"(?i)\b(?:with|a/?w|along\s*with)\s+(" + CASE_TOKEN + r")")


def parse_causelist_entries(text, pats):
    """Every matter on a causelist as a separate entry — both serial-numbered LEAD
    matters and the CONNECTED matters grouped with them ('...WITH <case-no>').
    Connected matters inherit the lead's serial/caption. This is essential because
    a connected matter can have its own (different) advocate."""
    marks = []  # (caseno_start, caseno_end, caseno, is_lead, serial)
    for m in LEAD_RE.finditer(text):
        marks.append((m.start(2), m.end(2), m.group(2), True, m.group(1)))
    seen_pos = {mk[0] for mk in marks}
    for m in CONN_RE.finditer(text):
        if m.start(1) not in seen_pos:
            marks.append((m.start(1), m.end(1), m.group(1), False, None))
    marks.sort(key=lambda x: x[0])
    starts = [mk[0] for mk in marks]

    entries = []
    cur_serial, cur_caption = "", ""
    by_serial = {}
    for idx, (s_pos, e_pos, caseno, is_lead, serial) in enumerate(marks):
        seg_end = starts[idx + 1] if idx + 1 < len(starts) else len(text)
        seg = text[e_pos:seg_end]
        if is_lead:
            cur_serial = serial
            pre = text[max(0, s_pos - 240):s_pos]
            caps = list(re.finditer(r"(?i)((?:[A-Z]{2,}-)?FOR\s+[A-Z][A-Za-z0-9 ,/&()\-]{0,55})", pre))
            if caps:
                cur_caption = re.sub(r"\s+\d+$", "", clean(caps[-1].group(1))).strip()
        # Parties: take the text up to REMARK, drop [Category] tags and the
        # watched advocate-firm names, then split on VS into petitioner/respondent.
        blob = re.split(r"\bREMARK", seg, maxsplit=1, flags=re.I)[0]
        blob = re.sub(r"\[[^\]]*\]", " ", blob)
        for _n, _rx in pats:
            blob = _rx.sub(" ", blob)
        blob = clean(blob)
        mvs = re.search(r"\bV[S/]\.?\b", blob, re.I)
        if mvs:
            parties = (short(blob[:mvs.start()].strip(), 55) + " v "
                       + short(blob[mvs.end():].strip(), 55)).strip(" v")
        else:
            parties = short(blob, 90)
        e = {"serial": cur_serial, "caseno": caseno, "caption": cur_caption,
             "parties": parties, "advocates": match_advocates(seg, pats), "connected": ""}
        entries.append(e)
        by_serial.setdefault(cur_serial, []).append(e)

    # 'connected' = the other case numbers sharing the same serial (the group).
    # Fold interlocutory applications (IA / Notice of Motion) into the parent so a
    # matter shows once — unless such an application is the only thing on the board.
    def _interloc(cn):
        mm = re.match(r"([A-Z]+)", cn)
        ab = mm.group(1) if mm else ""
        return ab == "IA" or ab.startswith("NM")
    for serial, group in by_serial.items():
        nums = [g["caseno"] for g in group]
        has_substantive = any(not _interloc(g["caseno"]) for g in group)
        for g in group:
            g["connected"] = ", ".join(n for n in nums if n != g["caseno"])
            g["folded"] = _interloc(g["caseno"]) and has_substantive
    return entries


def _causelist_lists_for_day(opener, token, secret, passp, juris, date_ddmm):
    """Return [{judge, court, list_type, text}] for every judge's causelist on a day."""
    body = urllib.parse.urlencode({
        "_token": token, "form_secret": secret, "chkpassphrase": passp,
        "m_juris": juris, "m_causedt": date_ddmm,
    }).encode()
    req = urllib.request.Request(SITE + "/bhc/causelist/get-data", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
    req.add_header("X-Requested-With", "XMLHttpRequest")
    req.add_header("Referer", SITE + "/bhc/causelistFinal")
    with opener.open(req, timeout=60) as r:
        j = json.loads(r.read().decode("utf-8", "replace"))
    if not j.get("status") or not j.get("page"):
        return []
    judges = parse_causelist_judges(j["page"])

    def fetch(task):
        judge, link = task
        try:
            rq = urllib.request.Request(link["href"], headers={"X-Requested-With": "XMLHttpRequest"})
            with opener.open(rq, timeout=60) as r:
                data = r.read()
            if data[:5] != b"%PDF-":
                return None
            text = pdf_text(data)
            mc = re.search(r"COURT\s*NO[.\s]*?(\d+)", text, re.I)
            return {"judge": judge, "list_type": link["label"],
                    "court": mc.group(1) if mc else "", "text": text}
        except Exception:
            return None

    tasks = [(jd["judge"], link) for jd in judges for link in jd["links"]]
    out = []
    # Four workers give good network throughput while keeping the scan gentle
    # on a fanless 8 GB MacBook Air when several PDFs need decompression.
    with ThreadPoolExecutor(max_workers=4) as ex:
        for res in ex.map(fetch, tasks):
            if res:
                out.append(res)
    return out


SCAN_LOCK = threading.Lock()
SCAN_STATE = {"scanning": False, "started": ""}


def causelist_scan_range(num_days=None):
    """Scan today..today+num_days-1; flag your matters + watched-advocate matters."""
    if not SCAN_LOCK.acquire(blocking=False):
        return {"already": True}
    SCAN_STATE["scanning"] = True
    SCAN_STATE["started"] = time.strftime("%H:%M")
    try:
        if num_days is None:
            num_days = load_settings().get("scan_days", 5)
        pats = adv_patterns()
        matters = load_matters()
        tracked = {}
        for m in matters:
            for cn in matter_casenos(m):
                tracked[cn.upper()] = m

        opener = make_opener()
        page_url = SITE + "/bhc/causelistFinal"
        with opener.open(urllib.request.Request(page_url), timeout=30) as r:
            page = r.read().decode("utf-8", "replace")
        token = extract_input_value(page, "_token")
        secret = extract_input_value(page, "form_secret")
        passp = extract_input_value(page, "chkpassphrase")
        juris = extract_input_value(page, "m_juris") or "B"

        today = datetime.date.today()
        days, rows = [], []
        for off in range(num_days):
            d = today + datetime.timedelta(days=off)
            ddmm = d.strftime("%d-%m-%Y")
            short_lbl = f"{d.day} {MONTHS[d.month - 1][:3]}"
            full_lbl = f"{d.day} {MONTHS[d.month - 1]} {d.year}"
            days.append({"date": ddmm, "short": short_lbl, "full": full_lbl})
            try:
                lists = _causelist_lists_for_day(opener, token, secret, passp, juris, ddmm)
            except Exception:
                continue
            for L in lists:
                entries = parse_causelist_entries(L["text"], pats)
                # carry a folded application's watched-advocate hit up to its parent
                folded_advs = {}
                for e in entries:
                    if e.get("folded"):
                        bucket = folded_advs.setdefault(e["serial"], [])
                        for ad in e["advocates"]:
                            if ad not in bucket:
                                bucket.append(ad)
                for e in entries:
                    if e.get("folded"):
                        continue  # IA / Notice of Motion shown under its parent
                    cnu = e["caseno"].upper()
                    tm = tracked.get(cnu)
                    advs = list(e["advocates"])
                    for ad in folded_advs.get(e["serial"], []):
                        if ad not in advs:
                            advs.append(ad)
                    if not tm and not advs:
                        continue
                    reasons = (["Your matter"] if tm else []) + advs
                    if tm:
                        name = (short(tm.get("petitioner") or "") + " v " + short(tm.get("respondent") or "")).strip(" v")
                    else:
                        name = e["parties"] or e["caseno"]
                    add = None
                    if not tm:
                        mm = re.match(r"([A-Z]+)(\(L\))?/(\d+)/(\d{4})", e["caseno"])
                        if mm:
                            add = {"abbr": mm.group(1), "stampreg": "S" if mm.group(2) else "R",
                                   "no": mm.group(3), "year": mm.group(4)}
                    rows.append({
                        "date": short_lbl, "date_full": full_lbl, "date_ddmm": ddmm,
                        "matter": name, "number": e["caseno"], "serial": e["serial"],
                        "list_type": L["list_type"], "judge": L["judge"], "court": L["court"],
                        "caption": e["caption"], "connected": e["connected"],
                        "reasons": reasons, "tracked": bool(tm), "add": add,
                    })

        # de-duplicate, then sort by day -> court -> serial
        seen, uniq = set(), []
        for r in rows:
            k = (r["date_full"], r["judge"], r["court"], r["serial"], r["number"])
            if k in seen:
                continue
            seen.add(k)
            uniq.append(r)

        def sort_key(r):
            try:
                d = datetime.datetime.strptime(r["date_full"], "%d %B %Y")
            except Exception:
                d = datetime.datetime.max
            return (d, int(r["court"]) if str(r["court"]).isdigit() else 9999,
                    int(r["serial"]) if str(r["serial"]).isdigit() else 9999)
        uniq.sort(key=sort_key)

        label = (days[0]["short"] + " – " + days[-1]["short"]) if days else ""
        result = {"generated_at": time.strftime("%Y-%m-%d %H:%M"), "days": days,
                  "range_label": label, "num_days": num_days, "rows": uniq}
        save_listings(result)

        # Heads-up notification: your matters listed today / tomorrow.
        try:
            t_lbl = f"{today.day} {MONTHS[today.month - 1]} {today.year}"
            tm_d = today + datetime.timedelta(days=1)
            tm_lbl = f"{tm_d.day} {MONTHS[tm_d.month - 1]} {tm_d.year}"
            n_today = len({r["number"] for r in uniq if r["tracked"] and r["date_full"] == t_lbl})
            n_tom = len({r["number"] for r in uniq if r["tracked"] and r["date_full"] == tm_lbl})
            bits = []
            if n_today:
                bits.append("%d today" % n_today)
            if n_tom:
                bits.append("%d tomorrow" % n_tom)
            if bits:
                notify_mac("Matters on board", "Your matters listed: " + ", ".join(bits) + ".")
        except Exception:
            pass
        return result
    finally:
        SCAN_STATE["scanning"] = False
        SCAN_LOCK.release()


def start_scan_async(num_days=None):
    if SCAN_STATE["scanning"]:
        return {"scanning": True}
    threading.Thread(target=causelist_scan_range, args=(num_days,), daemon=True).start()
    return {"started": True, "scanning": True}


_TYPE_CACHE = {}


def _types_for_side(side):
    if side not in _TYPE_CACHE:
        try:
            _TYPE_CACHE[side] = get_case_types(side)
        except Exception:
            _TYPE_CACHE[side] = []
    return _TYPE_CACHE[side]


def add_from_listing(add):
    """Resolve a causelist case-number to a real case and add it to My matters."""
    if not add:
        raise RuntimeError("Missing case details.")
    abbr = (add.get("abbr") or "").upper()
    stampreg = add.get("stampreg", "R")
    no, yr = add.get("no"), add.get("year")
    if not abbr or not no or not yr:
        raise RuntimeError("Could not read the case number.")
    last_err = None
    for side in ("2", "1"):  # try Original side first, then Appellate
        match = next((t for t in _types_for_side(side)
                      if t["label"].split(" - ")[0].strip().upper() == abbr), None)
        if not match:
            continue
        params = {"side": side, "stampreg": stampreg, "case_type": match["value"],
                  "type_name": match["label"], "case_no": str(no), "year": str(yr)}
        try:
            return add_matter(params)
        except Exception as e:
            last_err = e
            continue
    raise RuntimeError(str(last_err) if last_err else
                       f"Couldn't resolve case type '{abbr}'. Add it with + Add Case.")


def fetch_causelist_pdf(date_ddmm, judge, list_type):
    """Re-resolve and download a specific judge/list causelist PDF for a date."""
    opener = make_opener()
    page_url = SITE + "/bhc/causelistFinal"
    with opener.open(urllib.request.Request(page_url), timeout=30) as r:
        page = r.read().decode("utf-8", "replace")
    body = urllib.parse.urlencode({
        "_token": extract_input_value(page, "_token"),
        "form_secret": extract_input_value(page, "form_secret"),
        "chkpassphrase": extract_input_value(page, "chkpassphrase"),
        "m_juris": extract_input_value(page, "m_juris") or "B",
        "m_causedt": date_ddmm,
    }).encode()
    req = urllib.request.Request(SITE + "/bhc/causelist/get-data", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
    req.add_header("X-Requested-With", "XMLHttpRequest")
    req.add_header("Referer", page_url)
    with opener.open(req, timeout=60) as r:
        j = json.loads(r.read().decode("utf-8", "replace"))
    if not j.get("status") or not j.get("page"):
        return None

    def grab(href):
        rq = urllib.request.Request(href, headers={"X-Requested-With": "XMLHttpRequest"})
        with opener.open(rq, timeout=60) as r:
            data = r.read()
        return data if data[:5] == b"%PDF-" else None

    jl = (judge or "").strip().lower()
    tl = (list_type or "").strip().lower()
    judges = parse_causelist_judges(j["page"])
    for jd in judges:
        if jd["judge"].strip().lower() == jl:
            for link in jd["links"]:
                if link["label"].strip().lower() == tl:
                    return grab(link["href"])
            if jd["links"]:
                return grab(jd["links"][0]["href"])
    return None


def open_causelist(date_ddmm, judge, list_type):
    """Download a causelist PDF and open it natively in Preview."""
    data = fetch_causelist_pdf(date_ddmm, judge, list_type)
    if not data:
        raise RuntimeError("Could not fetch that causelist from the court site.")
    ensure_dirs()
    fn = sanitize(f"Causelist {list_type} {judge} {date_ddmm}")[:110] + ".pdf"
    dest = os.path.join(CAUSELIST_DIR, fn)
    with open(dest, "wb") as f:
        f.write(data)
    open_in_finder(dest)
    return {"ok": True, "path": dest}


# --------------------------------------------------------------------------
# Calendar export (.ics)
# --------------------------------------------------------------------------
def _parse_dmy(s):
    m = re.search(r"(\d{2})/(\d{2})/(\d{4})", s or "")
    if not m:
        return None
    try:
        return datetime.date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
    except Exception:
        return None


def _ics_escape(s):
    return (s or "").replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")


def export_ics(mid=None):
    """Build an .ics of upcoming listing/hearing dates and open it (Calendar)."""
    matters = load_matters()
    if mid:
        matters = [m for m in matters if m.get("id") == mid]
    today = datetime.date.today()
    stamp = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    lines = ["BEGIN:VCALENDAR", "VERSION:2.0",
             "PRODID:-//Bombay HC Matter Tracker//EN", "CALSCALE:GREGORIAN"]
    n = 0
    for m in matters:
        name = (short(m.get("petitioner") or "") + " v " + short(m.get("respondent") or "")).strip(" v")
        caseno = "%s/%s/%s" % ((m.get("type_name", "") or "").split(" - ")[0], m.get("case_no", ""), m.get("year", ""))
        seen_dates = set()
        for field, label in (("next_listing", "Listing"), ("next_hearing", "Hearing")):
            d = _parse_dmy(m.get(field, ""))
            if not d or d < today or d in seen_dates:
                continue
            seen_dates.add(d)
            n += 1
            uid = "bhc-%s-%s-%s@bhcmt" % (re.sub(r"\W", "", m.get("id", "")), field, d.strftime("%Y%m%d"))
            lines += ["BEGIN:VEVENT",
                      "UID:" + uid,
                      "DTSTAMP:" + stamp,
                      "DTSTART;VALUE=DATE:" + d.strftime("%Y%m%d"),
                      "SUMMARY:" + _ics_escape("%s — %s (%s)" % (label, name, caseno)),
                      "DESCRIPTION:" + _ics_escape("Bombay HC Matter Tracker · " + caseno),
                      "END:VEVENT"]
    lines.append("END:VCALENDAR")
    if not n:
        raise RuntimeError("No upcoming dd/mm/yyyy dates found to export. "
                           "Set 'Next hearing' dates or Refresh to pull next listings.")
    ensure_dirs()
    dest = os.path.join(EXPORT_DIR, "BHC hearings.ics")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("\r\n".join(lines) + "\r\n")
    open_in_finder(dest)
    return {"ok": True, "events": n, "path": dest}


# --------------------------------------------------------------------------
# Web server
# --------------------------------------------------------------------------
FALLBACK_HTML = ("<html><body style='font-family:sans-serif;padding:40px'>"
                 "<h2>UI file missing</h2><p>index.html was not found next to app.py.</p>"
                 "</body></html>")


def read_ui():
    try:
        with open(UI_FILE, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return FALLBACK_HTML


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype="application/json"):
        if isinstance(body, (dict, list)):
            body = json.dumps(body).encode("utf-8")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json_body(self):
        n = int(self.headers.get("Content-Length", 0) or 0)
        if not n:
            return {}
        try:
            return json.loads(self.rfile.read(n).decode("utf-8"))
        except Exception:
            return {}

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path == "/":
            return self._send(200, read_ui(), "text/html; charset=utf-8")
        if u.path == "/api/health":
            return self._send(200, {"ok": True})
        if u.path == "/api/version":
            return self._send(200, {"version": VERSION})
        if u.path == "/api/matters":
            return self._send(200, {"matters": load_matters(), "base_dir": BASE_DIR})
        if u.path == "/api/settings":
            return self._send(200, {"settings": load_settings()})
        if u.path == "/api/listings":
            d = annotate_listings(load_listings())
            d["scanning"] = SCAN_STATE["scanning"]
            return self._send(200, d)
        if u.path == "/api/case-types":
            side = urllib.parse.parse_qs(u.query).get("side", ["2"])[0]
            try:
                return self._send(200, {"types": get_case_types(side)})
            except Exception as e:
                return self._send(200, {"types": [], "error": str(e)})
        return self._send(404, {"error": "not found"})

    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        b = self._json_body()
        try:
            if u.path == "/api/add":
                return self._send(200, add_matter(b))
            if u.path == "/api/refresh":
                return self._send(200, refresh_matter(b.get("id")))
            if u.path == "/api/refresh-all":
                return self._send(200, refresh_all())
            if u.path == "/api/listings/scan":
                return self._send(200, start_scan_async(b.get("num_days")))
            if u.path == "/api/listings/add":
                return self._send(200, add_from_listing(b.get("add")))
            if u.path == "/api/causelist/open":
                return self._send(200, open_causelist(b.get("date", ""), b.get("judge", ""),
                                                      b.get("type", "")))
            if u.path == "/api/update":
                return self._send(200, update_matter(b.get("id"), b))
            if u.path == "/api/remove":
                return self._send(200, remove_matter(b.get("id")))
            if u.path == "/api/open":
                return self._send(200, open_folder(b.get("id")))
            if u.path == "/api/ics":
                return self._send(200, export_ics(b.get("id")))
            if u.path == "/api/settings":
                s = load_settings()
                if isinstance(b.get("watched"), list):
                    s["watched"] = [str(w).strip() for w in b["watched"] if str(w).strip()]
                if "scan_days" in b:
                    try:
                        s["scan_days"] = max(1, min(14, int(b["scan_days"])))
                    except Exception:
                        pass
                if "notify" in b:
                    s["notify"] = bool(b["notify"])
                save_settings(s)
                return self._send(200, {"settings": s})
            if u.path == "/api/quit":
                threading.Timer(0.3, lambda: os._exit(0)).start()
                return self._send(200, {"ok": True})
        except Exception as e:
            return self._send(200, {"error": str(e)})
        return self._send(404, {"error": "not found"})


class App(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def scheduler_loop():
    """Auto-scan: once on startup if stale, then daily at 07:00 and 22:00."""
    # Initial catch-up scan if we have no data for today.
    try:
        L = load_listings()
        gen = (L.get("generated_at") or "")[:10]
        if gen != time.strftime("%Y-%m-%d"):
            causelist_scan_range()
    except Exception:
        pass
    while True:
        now = datetime.datetime.now()
        candidates = [now.replace(hour=7, minute=0, second=0, microsecond=0),
                      now.replace(hour=22, minute=0, second=0, microsecond=0)]
        future = [t for t in candidates if t > now]
        nxt = min(future) if future else (candidates[0] + datetime.timedelta(days=1))
        time.sleep(max(60, (nxt - now).total_seconds()))
        try:
            causelist_scan_range()
        except Exception:
            pass


def main():
    ensure_dirs()
    try:
        httpd = App((HOST, PORT), Handler)
    except OSError:
        # Port busy — another instance is already serving.
        return
    threading.Thread(target=scheduler_loop, daemon=True).start()
    if "--serve" not in sys.argv:
        print(f"Serving on http://{HOST}:{PORT}/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
