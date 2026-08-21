import { a as useTracker, d as matterCasenos, f as short, y as prettyCourtDay } from "./router-Bf7uN__Z.mjs";
import { D as scanCauselistBatch, O as useUi, x as fetchCauselistJudges } from "./card-BDUGGpAD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-eV4xE6y2.js
async function runCauselistScan(numDays) {
	const { matters, settings, mergeListingRows, setListings, log } = useTracker.getState();
	const { setScanProgress } = useUi.getState();
	setListings({ scanning: true });
	const tracked = matters.flatMap(matterCasenos);
	const days = Array.from({ length: numDays }, (_, i) => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + i);
		return prettyCourtDay(d);
	});
	const allRows = [];
	try {
		for (const day of days) {
			setScanProgress(`Boards for ${day.short}…`);
			const res = await fetchCauselistJudges({ data: { date: day.date } });
			if (!res.ok) {
				setScanProgress(res.error);
				continue;
			}
			const items = res.judges.flatMap((j) => j.links.map((l) => ({
				href: l.href,
				judge: j.judge,
				list_type: l.label
			})));
			if (!items.length) continue;
			const chunk = 8;
			for (let i = 0; i < items.length; i += chunk) {
				const slice = items.slice(i, i + chunk);
				setScanProgress(`${day.short}: lists ${i + 1}–${Math.min(i + chunk, items.length)} of ${items.length}`);
				const scanned = await scanCauselistBatch({ data: {
					items: slice,
					watched: settings.watched,
					tracked
				} });
				if (!scanned.ok) continue;
				for (const hit of scanned.hits) {
					const mine = tracked.includes(hit.caseno.toUpperCase());
					const m = matters.find((x) => matterCasenos(x).includes(hit.caseno.toUpperCase()));
					const mm = hit.caseno.match(/^([A-Z]+)(\(L\))?\/(\d+)\/(\d{4})$/i);
					allRows.push({
						date: day.short,
						date_full: day.full,
						date_ddmm: day.date,
						matter: mine && m ? `${short(m.petitioner)} v ${short(m.respondent)}`.replace(/^ v | v$/g, "") : hit.parties || hit.caseno,
						number: hit.caseno,
						serial: hit.serial,
						list_type: hit.list_type,
						judge: hit.judge,
						court: hit.court,
						caption: hit.caption,
						connected: hit.connected,
						reasons: [...mine ? ["Your matter"] : [], ...hit.advocates],
						tracked: mine,
						mid: m?.id ?? null,
						add: mine || !mm ? null : {
							abbr: mm[1],
							stampreg: mm[2] ? "S" : "R",
							no: mm[3],
							year: mm[4]
						}
					});
				}
			}
		}
		mergeListingRows(allRows, days, numDays);
		const mine = allRows.filter((r) => r.tracked).length;
		log("scan", `Cause lists updated`, `${mine} of your matters listed`);
		if (settings.notify && typeof Notification !== "undefined") {
			const today = prettyCourtDay(/* @__PURE__ */ new Date());
			const nToday = new Set(allRows.filter((r) => r.tracked && r.date_full === today.full).map((r) => r.number)).size;
			if (nToday && Notification.permission === "granted") new Notification("Matters on board", { body: `${nToday} of your matters listed today.` });
		}
		return {
			ok: true,
			rows: allRows.length
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Scan failed."
		};
	} finally {
		setListings({ scanning: false });
		setScanProgress("");
	}
}
async function requestNotify() {
	if (typeof Notification === "undefined") return false;
	if (Notification.permission === "granted") return true;
	if (Notification.permission === "denied") return false;
	return await Notification.requestPermission() === "granted";
}
//#endregion
export { runCauselistScan as n, requestNotify as t };
