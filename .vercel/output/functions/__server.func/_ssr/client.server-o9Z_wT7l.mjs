import nodeHTTPS from "node:https";
import { constants } from "node:crypto";
import { Buffer } from "node:buffer";
import { inflateRawSync, inflateSync, unzipSync } from "node:zlib";
//#region node_modules/.nitro/vite/services/ssr/assets/client.server-o9Z_wT7l.js
function firmRegex(name) {
	const tokens = (name || "").match(/[A-Za-z]+/g) || [];
	const parts = [];
	for (const t of tokens) {
		const tl = t.toLowerCase();
		if (tl === "and") continue;
		if (tl === "co" || tl === "company") parts.push("(?:co|company)\\b");
		else parts.push(escapeRe$1(tl));
	}
	if (!parts.length) return null;
	return new RegExp(parts.join("[\\s,.]*(?:&|and)?[\\s,.]*"), "i");
}
function matchAdvocates(text, pats) {
	return pats.filter((p) => p.rx.test(text)).map((p) => p.name);
}
function buildFirmPatterns(watched) {
	const pats = [];
	for (const name of watched) {
		const rx = firmRegex(name);
		if (rx) pats.push({
			name: name.trim(),
			rx
		});
	}
	return pats;
}
var CASE_TOKEN = "[A-Z]{2,8}(?:\\([A-Z]+\\))?/\\d+/\\d{4}";
var LEAD_RE = new RegExp(`(\\d+)\\s+(${CASE_TOKEN})`, "g");
var CONN_RE = new RegExp(`(?:with|a/?w|along\\s*with)\\s+(${CASE_TOKEN})`, "gi");
function clean$1(s) {
	return s.replace(/\s+/g, " ").trim();
}
function short(s, n = 55) {
	const t = clean$1(s);
	return t.length > n ? t.slice(0, n).trim() : t;
}
function isInterloc(cn) {
	const ab = (cn.match(/^[A-Z]+/) || [""])[0];
	return ab === "IA" || ab.startsWith("NM");
}
function parseCauselistEntries(text, pats) {
	const marks = [];
	for (const m of text.matchAll(LEAD_RE)) marks.push({
		s: m.index + m[0].indexOf(m[2]),
		e: m.index + m[0].length,
		caseno: m[2],
		isLead: true,
		serial: m[1]
	});
	const seen = new Set(marks.map((mk) => mk.s));
	for (const m of text.matchAll(CONN_RE)) {
		const start = m.index + m[0].lastIndexOf(m[1]);
		if (!seen.has(start)) marks.push({
			s: start,
			e: start + m[1].length,
			caseno: m[1],
			isLead: false,
			serial: null
		});
	}
	marks.sort((a, b) => a.s - b.s);
	const starts = marks.map((mk) => mk.s);
	const entries = [];
	const bySerial = {};
	let curSerial = "";
	let curCaption = "";
	marks.forEach((mk, idx) => {
		const segEnd = idx + 1 < starts.length ? starts[idx + 1] : text.length;
		const seg = text.slice(mk.e, segEnd);
		if (mk.isLead) {
			curSerial = mk.serial || "";
			const caps = [...text.slice(Math.max(0, mk.s - 240), mk.s).matchAll(/((?:[A-Z]{2,}-)?FOR\s+[A-Z][A-Za-z0-9 ,/&()\-]{0,55})/gi)];
			if (caps.length) curCaption = clean$1(caps[caps.length - 1][1]).replace(/\s+\d+$/, "");
		}
		let blob = seg.split(/\bREMARK/i)[0];
		blob = blob.replace(/\[[^\]]*\]/g, " ");
		for (const p of pats) blob = blob.replace(p.rx, " ");
		blob = clean$1(blob);
		const mvs = blob.match(/\bV[S/]\.?\b/i);
		let parties;
		if (mvs && mvs.index !== void 0) parties = `${short(blob.slice(0, mvs.index), 55)} v ${short(blob.slice(mvs.index + mvs[0].length), 55)}`.replace(/^ v | v $/g, "");
		else parties = short(blob, 90);
		const e = {
			serial: curSerial,
			caseno: mk.caseno,
			caption: curCaption,
			parties,
			advocates: matchAdvocates(seg, pats),
			connected: "",
			folded: false
		};
		entries.push(e);
		(bySerial[curSerial] ||= []).push(e);
	});
	for (const group of Object.values(bySerial)) {
		const nums = group.map((g) => g.caseno);
		const hasSubstantive = group.some((g) => !isInterloc(g.caseno));
		for (const g of group) {
			g.connected = nums.filter((n) => n !== g.caseno).join(", ");
			g.folded = isInterloc(g.caseno) && hasSubstantive;
		}
	}
	return entries;
}
function escapeRe$1(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var SITE = "https://bombayhighcourt.gov.in";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";
var COURT_SITE = SITE;
var agent = new nodeHTTPS.Agent({
	secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
	keepAlive: true,
	maxSockets: 8
});
var CookieJar = class {
	cookies = /* @__PURE__ */ new Map();
	absorb(setCookie) {
		const list = !setCookie ? [] : Array.isArray(setCookie) ? setCookie : [setCookie];
		for (const c of list) {
			const nv = c.split(";")[0];
			const eq = nv.indexOf("=");
			if (eq > 0) this.cookies.set(nv.slice(0, eq).trim(), nv.slice(eq + 1));
		}
	}
	header() {
		return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
	}
};
async function courtRequest(url, opts = {}) {
	const follow = opts.follow !== false;
	let current = url;
	let method = opts.method ?? "GET";
	let body = opts.body;
	let hops = 0;
	const jar = opts.jar ?? new CookieJar();
	while (hops < 8) {
		const res = await rawRequest(current, {
			method,
			headers: {
				"User-Agent": UA,
				Accept: "*/*",
				...opts.headers ?? {},
				...jar.header() ? { Cookie: jar.header() } : {}
			},
			body,
			timeoutMs: opts.timeoutMs ?? 3e4
		});
		jar.absorb(res.headers["set-cookie"]);
		const loc = header(res.headers, "location");
		if (follow && loc && [
			301,
			302,
			303,
			307,
			308
		].includes(res.status) && hops < 7) {
			current = new URL(loc, current).href;
			if (res.status === 303 || res.status === 302 || res.status === 301) {
				method = "GET";
				body = void 0;
			}
			hops += 1;
			continue;
		}
		return {
			...res,
			url: current
		};
	}
	throw new Error("Too many redirects from the court site.");
}
function header(headers, name) {
	const v = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(v)) return v[0];
	return v;
}
function rawRequest(url, opts) {
	return new Promise((resolve, reject) => {
		const u = new URL(url);
		const headers = { ...opts.headers };
		if (opts.body && !headers["Content-Length"]) {
			const len = Buffer.isBuffer(opts.body) ? opts.body.length : Buffer.byteLength(opts.body);
			headers["Content-Length"] = String(len);
		}
		const req = nodeHTTPS.request({
			protocol: u.protocol,
			hostname: u.hostname,
			port: u.port || 443,
			path: u.pathname + u.search,
			method: opts.method,
			agent,
			headers
		}, (res) => {
			const chunks = [];
			res.on("data", (c) => chunks.push(c));
			res.on("end", () => {
				resolve({
					status: res.statusCode ?? 0,
					headers: res.headers,
					buf: Buffer.concat(chunks),
					url
				});
			});
		});
		req.on("error", reject);
		req.setTimeout(opts.timeoutMs, () => {
			req.destroy(/* @__PURE__ */ new Error("The court site timed out."));
		});
		if (opts.body) req.write(opts.body);
		req.end();
	});
}
async function courtGet(path, jar) {
	return courtRequest(path.startsWith("http") ? path : SITE + path, { jar });
}
async function courtPostForm(path, fields, jar, extra = {}) {
	return courtRequest(path.startsWith("http") ? path : SITE + path, {
		method: "POST",
		jar,
		body: new URLSearchParams(fields).toString(),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"X-Requested-With": "XMLHttpRequest",
			...extra
		},
		timeoutMs: 6e4
	});
}
async function mapPool(items, n, fn) {
	const out = new Array(items.length);
	let i = 0;
	const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
		while (i < items.length) {
			const idx = i++;
			out[idx] = await fn(items[idx], idx);
		}
	});
	await Promise.all(workers);
	return out;
}
function extractInputValue(page, name) {
	const a = page.match(new RegExp(`<input[^>]*\\bname="${escapeRe(name)}"[^>]*\\bvalue="([^"]*)"`, "i"));
	if (a) return a[1];
	const b = page.match(new RegExp(`<input[^>]*\\bvalue="([^"]*)"[^>]*\\bname="${escapeRe(name)}"`, "i"));
	return b ? b[1] : "";
}
function stripTags(s) {
	return (s || "").replace(/<[^>]+>/g, " ");
}
function decodeEntities(s) {
	return (s || "").replace(/&nbsp;/gi, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;/g, "'").replace(/&#x27;/gi, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}
function clean(s) {
	return decodeEntities(stripTags(s)).replace(/\s+/g, " ").trim();
}
function orderKey(o) {
	return `${o.date || ""}|${o.doc || ""}`.replace(/^\||\|$/g, "");
}
function afterLabel(text, label) {
	const m = text.match(new RegExp(`${escapeRe(label)}\\s*[:\\-–]?\\s*([^\\n]{1,80})`, "i"));
	return m ? clean(m[1]) : "";
}
function dateAfter(text, label) {
	const m = text.match(new RegExp(`${escapeRe(label)}[^0-9]{0,24}(\\d{2}/\\d{2}/\\d{4})`, "i"));
	return m ? m[1] : "";
}
function extractParties(page) {
	const text = clean(page);
	const m = text.match(/\bby\s+(.+?)\s+against\s+(.+?)(?:\s+District|\s+Filing Number|\s+Lodging Number|\s+Registration Date|\s+Next Listing|\s+Disposal|\.\s|$)/i);
	if (m) return [clean(m[1]), clean(m[2])];
	const pet = afterLabel(text, "Petitioner");
	const res = afterLabel(text, "Respondent");
	return [pet.split(" Petitioner")[0], res.split(" Petitioner")[0] || res];
}
function extractMeta(page) {
	const text = clean(page);
	const cnr = (text.match(/\b(HCBM\w+)\b/) || [])[1] || "";
	const filed = (text.match(/filed on\s+(\d{2}\/\d{2}\/\d{4})/i) || [])[1] || "";
	const status = afterLabel(text, "Status").replace(/Petitioner.*$/i, "").replace(/_/g, " ").trim().slice(0, 48);
	const lodging = (text.match(/Lodging Number\s+([A-Z]+\(?L?\)?\/\d+\/\d{4})/i) || [])[1] || "";
	const petAdv = afterLabel(text, "Petitioner's Advocate").replace(/Respondent's Advocate.*$/i, "").slice(0, 120);
	const resAdv = afterLabel(text, "Respondent's Advocate").replace(/Last Date.*$/i, "").slice(0, 120);
	const stage = afterLabel(text, "Stage").replace(/Last Coram.*$/i, "").slice(0, 80);
	const act = afterLabel(text, "Act").replace(/Under Section.*$/i, "").slice(0, 80);
	const lastCoram = afterLabel(text, "Last Coram").replace(/Act .*$/i, "").slice(0, 160);
	return {
		cnr,
		filed_on: filed,
		registration_date: dateAfter(text, "Registration Date"),
		status,
		disposal_date: dateAfter(text, "Disposal Date"),
		lodging,
		next_listing: dateAfter(text, "Next Listing Date"),
		petitioner_adv: petAdv === "—" ? "" : petAdv,
		respondent_adv: resAdv === "—" ? "" : resAdv,
		stage: stage === "—" ? "" : stage,
		act,
		last_coram: lastCoram === "—" ? "" : lastCoram
	};
}
var ORDER_HREF = /href="([^"]*(?:file\/download|order-pdf|casestatus\/order)[^"]*)"/i;
function extractOrdersWithHref(page) {
	const idxDoc = page.search(/View Document|order-pdf|file\/download/i);
	if (idxDoc < 0) return [];
	const start = page.lastIndexOf("<table", idxDoc);
	const end = page.indexOf("</table>", idxDoc);
	const table = start >= 0 && end >= 0 ? page.slice(start, end) : page;
	const orders = [];
	for (const row of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
		const html = row[1];
		const hrefM = html.match(ORDER_HREF);
		if (!hrefM) continue;
		const cells = [...html.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => clean(c[1]));
		let date = "";
		for (const t of cells) {
			const m = t.match(/\d{2}\/\d{2}\/\d{4}/);
			if (m) {
				date = m[0];
				break;
			}
		}
		const o = {
			srl: cells[0] || "",
			date,
			doc: cells[3] || "",
			coram: cells[1] || "",
			href: decodeEntities(hrefM[1])
		};
		orders.push({
			key: orderKey(o),
			srl: o.srl,
			date: o.date,
			doc: o.doc,
			coram: o.coram,
			href: o.href
		});
	}
	return orders;
}
function parseCauselistJudges(page) {
	const judges = [];
	for (const row of page.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
		const html = row[1];
		if (!/file\/download/i.test(html)) continue;
		const judge = [...html.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => clean(c[1]))[0] || "";
		const links = [];
		for (const a of html.matchAll(/href="([^"]*file\/download[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) links.push({
			href: decodeEntities(a[1]),
			label: clean(a[2]) || "Causelist"
		});
		if (judge && links.length) judges.push({
			judge,
			links
		});
	}
	return judges;
}
function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function inflate(raw) {
	for (const fn of [
		unzipSync,
		inflateSync,
		inflateRawSync
	]) try {
		const out = fn(raw);
		if (out && out.length) return out;
	} catch {}
	return null;
}
function extractOps(decoded) {
	const s = decoded.toString("latin1");
	const res = [];
	let i = 0;
	const L = s.length;
	while (i < L) {
		if (s[i] === "(") {
			let j = i + 1;
			let depth = 1;
			const buf = [];
			while (j < L && depth > 0) {
				const d = s[j];
				if (d === "\\") {
					const n = s[j + 1] ?? "";
					if (n === "n") buf.push("\n");
					else if (n === "r") {} else if (n === "t") buf.push(" ");
					else if (n && "01234567".includes(n)) {
						let o = n;
						let k = j + 2;
						while (k < L && "01234567".includes(s[k]) && o.length < 3) {
							o += s[k];
							k += 1;
						}
						buf.push(String.fromCharCode(parseInt(o, 8) & 255));
						j = k;
						continue;
					} else buf.push(n);
					j += 2;
					continue;
				}
				if (d === "(") {
					depth += 1;
					buf.push(d);
					j += 1;
				} else if (d === ")") {
					depth -= 1;
					if (depth > 0) buf.push(d);
					j += 1;
				} else {
					buf.push(d);
					j += 1;
				}
			}
			res.push(buf.join(""));
			i = j;
			continue;
		}
		if (s.startsWith("Td", i) || s.startsWith("TD", i) || s.startsWith("T*", i)) {
			res.push("\n");
			i += 2;
			continue;
		}
		i += 1;
	}
	return res.join("");
}
function pdfText(data) {
	const out = [];
	let i = 0;
	while (true) {
		const s = data.indexOf("stream", i);
		if (s < 0) break;
		let j = s + 6;
		if (data[j] === 13 && data[j + 1] === 10) j += 2;
		else if (data[j] === 10 || data[j] === 13) j += 1;
		const e = data.indexOf("endstream", j);
		if (e < 0) break;
		const raw = data.subarray(j, e);
		i = e + 9;
		const dec = inflate(raw);
		if (!dec) continue;
		if (!dec.includes("Tj") && !dec.includes("TJ")) continue;
		try {
			out.push(extractOps(dec));
		} catch {}
	}
	return out.join("").replace(/\x00/g, "");
}
function excerptText(text, max = 3500) {
	const t = text.replace(/\s+/g, " ").trim();
	return t.length > max ? t.slice(0, max).trim() : t;
}
var typeCache = /* @__PURE__ */ new Map();
async function getCaseTypes(side) {
	const key = String(side);
	const hit = typeCache.get(key);
	if (hit) return hit;
	const jar = new CookieJar();
	const res = await courtGet(`/bhc/get-case-types-by-side?side=${encodeURIComponent(key)}`, jar);
	const data = JSON.parse(res.buf.toString("utf8"));
	const out = [];
	for (const t of Array.isArray(data) ? data : []) {
		if (!t || t.case_type == null) continue;
		const name = t.type_name || "";
		const full = t.full_form || name;
		out.push({
			value: String(t.case_type),
			label: name ? `${name} - ${full}` : full
		});
	}
	out.sort((a, b) => a.label.localeCompare(b.label));
	typeCache.set(key, out);
	return out;
}
async function openCasePage(params) {
	const jar = new CookieJar();
	const pageUrl = `${COURT_SITE}/bhc/casestatus/casenumber`;
	const page = (await courtGet(pageUrl, jar)).buf.toString("utf8");
	const token = extractInputValue(page, "_token");
	const secret = extractInputValue(page, "form_secret");
	if (!token) throw new Error("Could not obtain a session token from the court site.");
	const search = await courtPostForm(pageUrl, {
		_token: token,
		form_secret: secret,
		side: params.side,
		stampreg: params.stampreg,
		case_type: params.case_type,
		case_no: params.case_no,
		year: params.year
	}, jar, { Referer: pageUrl });
	let json;
	try {
		json = JSON.parse(search.buf.toString("utf8"));
	} catch {
		throw new Error("The court site returned an unexpected response.");
	}
	if (!json.status || !json.page) throw new Error(json.message || "No case found for those details.");
	return {
		jar,
		html: json.page
	};
}
async function lookupCase(params) {
	const { html } = await openCasePage(params);
	const [petitioner, respondent] = extractParties(html);
	const meta = extractMeta(html);
	const orders = extractOrdersWithHref(html).map(({ href: _h, ...rest }) => rest);
	return {
		petitioner,
		respondent,
		...meta,
		orders
	};
}
function isPdf(buf) {
	return buf.subarray(0, 5).toString("utf8") === "%PDF-";
}
async function downloadPdf(href, jar) {
	const res = await courtRequest(href, {
		jar,
		timeoutMs: 9e4,
		headers: {
			"X-Requested-With": "XMLHttpRequest",
			Referer: `${COURT_SITE}/bhc/casestatus/casenumber`,
			Accept: "application/pdf,*/*"
		}
	});
	if (!isPdf(res.buf)) return null;
	return res.buf;
}
function sanitize(s, maxlen = 80) {
	return s.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim().replace(/\.+$/, "").slice(0, maxlen).trim();
}
async function downloadOrders(params, keys, parties = {}) {
	const want = new Set(keys);
	const { jar, html } = await openCasePage(params);
	const orders = extractOrdersWithHref(html).filter((o) => want.has(o.key));
	const pet = sanitize(parties.petitioner || "Petitioner", 40);
	const resp = sanitize(parties.respondent || "Respondent", 40);
	return (await mapPool(orders, 4, async (o) => {
		try {
			const buf = await downloadPdf(o.href, jar);
			if (!buf) return null;
			const filename = sanitize(`${(o.date || "").replace(/\//g, "")} ${pet} v ${resp}`) + ".pdf";
			const excerpt = excerptText(pdfText(buf));
			return {
				key: o.key,
				filename,
				base64: buf.toString("base64"),
				excerpt,
				date: o.date,
				doc: o.doc,
				coram: o.coram
			};
		} catch {
			return null;
		}
	})).filter((x) => x !== null);
}
async function listCauselistDay(dateDdMm) {
	const jar = new CookieJar();
	const pageUrl = `${COURT_SITE}/bhc/causelistFinal`;
	const page = (await courtGet(pageUrl, jar)).buf.toString("utf8");
	const body = {
		_token: extractInputValue(page, "_token"),
		form_secret: extractInputValue(page, "form_secret"),
		chkpassphrase: extractInputValue(page, "chkpassphrase"),
		m_juris: extractInputValue(page, "m_juris") || "B",
		m_causedt: dateDdMm
	};
	const res = await courtPostForm(`${COURT_SITE}/bhc/causelist/get-data`, body, jar, { Referer: pageUrl });
	let json;
	try {
		json = JSON.parse(res.buf.toString("utf8"));
	} catch {
		return [];
	}
	if (!json.status || !json.page) return [];
	return parseCauselistJudges(json.page);
}
async function scanCauselistPdfs(input) {
	const pats = buildFirmPatterns(input.watched);
	const tracked = new Set(input.tracked.map((t) => t.toUpperCase()));
	const jar = new CookieJar();
	await courtGet(`${COURT_SITE}/bhc/causelistFinal`, jar);
	const hits = [];
	const results = await mapPool(input.items, 4, async (item) => {
		try {
			const res = await courtRequest(item.href, {
				jar,
				timeoutMs: 6e4,
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					Referer: `${COURT_SITE}/bhc/causelistFinal`
				}
			});
			if (!isPdf(res.buf)) return [];
			const text = pdfText(res.buf);
			const court = (text.match(/COURT\s*NO[.\s]*?(\d+)/i) || [])[1] || "";
			const entries = parseCauselistEntries(text, pats);
			const foldedAdvs = {};
			for (const e of entries) {
				if (!e.folded) continue;
				const bucket = foldedAdvs[e.serial] ||= [];
				for (const ad of e.advocates) if (!bucket.includes(ad)) bucket.push(ad);
			}
			const out = [];
			for (const e of entries) {
				if (e.folded) continue;
				const advs = [...e.advocates];
				for (const ad of foldedAdvs[e.serial] || []) if (!advs.includes(ad)) advs.push(ad);
				if (!tracked.has(e.caseno.toUpperCase()) && !advs.length) continue;
				out.push({
					serial: e.serial,
					caseno: e.caseno,
					caption: e.caption,
					parties: e.parties,
					connected: e.connected,
					advocates: advs,
					judge: item.judge,
					list_type: item.list_type,
					court
				});
			}
			return out;
		} catch {
			return [];
		}
	});
	for (const group of results) hits.push(...group);
	return hits;
}
async function fetchCauselistPdf(input) {
	const judges = await listCauselistDay(input.date);
	const jl = input.judge.trim().toLowerCase();
	const tl = input.list_type.trim().toLowerCase();
	const jar = new CookieJar();
	await courtGet(`${COURT_SITE}/bhc/causelistFinal`, jar);
	for (const jd of judges) {
		if (jd.judge.trim().toLowerCase() !== jl) continue;
		const link = jd.links.find((l) => l.label.trim().toLowerCase() === tl) ?? jd.links[0];
		if (!link) continue;
		const res = await courtRequest(link.href, {
			jar,
			timeoutMs: 9e4,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				Referer: `${COURT_SITE}/bhc/causelistFinal`
			}
		});
		if (!isPdf(res.buf)) return null;
		return {
			filename: sanitize(`Causelist ${input.list_type} ${input.judge} ${input.date}`, 110) + ".pdf",
			base64: res.buf.toString("base64")
		};
	}
	return null;
}
async function resolveListingAdd(add) {
	const abbr = (add.abbr || "").toUpperCase();
	let lastErr = "Could not resolve that case type.";
	for (const side of ["2", "1"]) {
		const match = (await getCaseTypes(side)).find((t) => t.label.split(" - ")[0].trim().toUpperCase() === abbr);
		if (!match) continue;
		const params = {
			side,
			stampreg: add.stampreg,
			case_type: match.value,
			case_no: String(add.no),
			year: String(add.year)
		};
		try {
			const lookup = await lookupCase(params);
			return {
				params,
				type_name: match.label,
				lookup
			};
		} catch (e) {
			lastErr = e instanceof Error ? e.message : String(e);
		}
	}
	throw new Error(lastErr);
}
//#endregion
export { downloadOrders, fetchCauselistPdf, getCaseTypes, listCauselistDay, lookupCase, resolveListingAdd, scanCauselistPdfs };
