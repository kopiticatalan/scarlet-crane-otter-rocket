import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-DP1m1qkv.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupSchema = object({
	side: string(),
	stampreg: _enum(["R", "S"]),
	case_type: string(),
	case_no: string(),
	year: string()
});
var fetchCaseTypes_createServerFn_handler = createServerRpc({
	id: "81ee1bb9a9c68ebf0caa59b00c992999cd179f01c477e5503eee98c358e9ac90",
	name: "fetchCaseTypes",
	filename: "src/lib/court/actions.ts"
}, (opts) => fetchCaseTypes.__executeServer(opts));
var fetchCaseTypes = createServerFn({ method: "POST" }).validator(object({ side: string() })).handler(fetchCaseTypes_createServerFn_handler, async ({ data }) => {
	try {
		const { getCaseTypes } = await import("./client.server-o9Z_wT7l.mjs");
		return {
			ok: true,
			types: await getCaseTypes(data.side)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not load case types.",
			types: []
		};
	}
});
var fetchCase_createServerFn_handler = createServerRpc({
	id: "3d7c072bc243f937338fe2e4ae8c840004e0ad2b5c30aa19297d6bbe924abf86",
	name: "fetchCase",
	filename: "src/lib/court/actions.ts"
}, (opts) => fetchCase.__executeServer(opts));
var fetchCase = createServerFn({ method: "POST" }).validator(lookupSchema).handler(fetchCase_createServerFn_handler, async ({ data }) => {
	try {
		const { lookupCase } = await import("./client.server-o9Z_wT7l.mjs");
		return {
			ok: true,
			lookup: await lookupCase(data)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not find that case."
		};
	}
});
var fetchOrderPdfs_createServerFn_handler = createServerRpc({
	id: "9038a791cce0c90f0075e6a2b74abd3aab02fa0ff657c4a85492e37983f3a058",
	name: "fetchOrderPdfs",
	filename: "src/lib/court/actions.ts"
}, (opts) => fetchOrderPdfs.__executeServer(opts));
var fetchOrderPdfs = createServerFn({ method: "POST" }).validator(lookupSchema.extend({
	keys: array(string()),
	petitioner: string().optional(),
	respondent: string().optional()
})).handler(fetchOrderPdfs_createServerFn_handler, async ({ data }) => {
	try {
		const { downloadOrders } = await import("./client.server-o9Z_wT7l.mjs");
		const { keys, petitioner, respondent, ...params } = data;
		return {
			ok: true,
			files: await downloadOrders(params, keys, {
				petitioner,
				respondent
			})
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not download orders.",
			files: []
		};
	}
});
var fetchCauselistJudges_createServerFn_handler = createServerRpc({
	id: "f77ee6a5de5bd814c06ed71a3dab1143a48cdf5a4f45d35f42705d3837e964ae",
	name: "fetchCauselistJudges",
	filename: "src/lib/court/actions.ts"
}, (opts) => fetchCauselistJudges.__executeServer(opts));
var fetchCauselistJudges = createServerFn({ method: "POST" }).validator(object({ date: string() })).handler(fetchCauselistJudges_createServerFn_handler, async ({ data }) => {
	try {
		const { listCauselistDay } = await import("./client.server-o9Z_wT7l.mjs");
		return {
			ok: true,
			judges: await listCauselistDay(data.date)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not load the cause list.",
			judges: []
		};
	}
});
var scanCauselistBatch_createServerFn_handler = createServerRpc({
	id: "9f3c10d81c5cf23986ebd5e17c3b78d002c0af53dd5cc0aa38c80b7b95bf3c02",
	name: "scanCauselistBatch",
	filename: "src/lib/court/actions.ts"
}, (opts) => scanCauselistBatch.__executeServer(opts));
var scanCauselistBatch = createServerFn({ method: "POST" }).validator(object({
	items: array(object({
		href: string(),
		judge: string(),
		list_type: string()
	})),
	watched: array(string()),
	tracked: array(string())
})).handler(scanCauselistBatch_createServerFn_handler, async ({ data }) => {
	try {
		const { scanCauselistPdfs } = await import("./client.server-o9Z_wT7l.mjs");
		return {
			ok: true,
			hits: await scanCauselistPdfs(data)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Cause-list scan failed.",
			hits: []
		};
	}
});
var downloadCauselistPdf_createServerFn_handler = createServerRpc({
	id: "4fc4774d74f2d4f43930d4062427105709e1b663d7ff52b874755775b455ba1a",
	name: "downloadCauselistPdf",
	filename: "src/lib/court/actions.ts"
}, (opts) => downloadCauselistPdf.__executeServer(opts));
var downloadCauselistPdf = createServerFn({ method: "POST" }).validator(object({
	date: string(),
	judge: string(),
	list_type: string()
})).handler(downloadCauselistPdf_createServerFn_handler, async ({ data }) => {
	try {
		const { fetchCauselistPdf } = await import("./client.server-o9Z_wT7l.mjs");
		const file = await fetchCauselistPdf(data);
		if (!file) return {
			ok: false,
			error: "Could not fetch that cause list."
		};
		return {
			ok: true,
			file
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not fetch that cause list."
		};
	}
});
var resolveListing_createServerFn_handler = createServerRpc({
	id: "831a1ec3e7ec0c2d54a8bbcc13cb2199f27e2e216b686607b57d4451538833a2",
	name: "resolveListing",
	filename: "src/lib/court/actions.ts"
}, (opts) => resolveListing.__executeServer(opts));
var resolveListing = createServerFn({ method: "POST" }).validator(object({
	abbr: string(),
	stampreg: _enum(["R", "S"]),
	no: string(),
	year: string()
})).handler(resolveListing_createServerFn_handler, async ({ data }) => {
	try {
		const { resolveListingAdd } = await import("./client.server-o9Z_wT7l.mjs");
		return {
			ok: true,
			...await resolveListingAdd(data)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not add that matter."
		};
	}
});
var draftHearingBrief_createServerFn_handler = createServerRpc({
	id: "9b8b8048f0a1fca549c198fdaedf0f818980fab6f96dfabcec32fd7068f715d5",
	name: "draftHearingBrief",
	filename: "src/lib/court/actions.ts"
}, (opts) => draftHearingBrief.__executeServer(opts));
var draftHearingBrief = createServerFn({ method: "POST" }).validator(object({
	caption: string(),
	caseno: string(),
	status: string().optional(),
	listing: string().optional(),
	coram: string().optional(),
	tasks: array(string()),
	notes: array(string()),
	excerpts: array(object({
		date: string(),
		doc: string(),
		text: string()
	}))
})).handler(draftHearingBrief_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI briefing is not available in this environment."
	};
	const orderBlock = data.excerpts.slice(0, 3).map((o, i) => `Order ${i + 1} (${o.date} · ${o.doc}):\n${o.text.slice(0, 1800)}`).join("\n\n");
	const prompt = `You are a chambers junior briefing counsel for a Bombay High Court listing. Write a tight hearing note. No fluff. Use short headings.

Matter: ${data.caption}
Case: ${data.caseno}
Status: ${data.status || "—"}
Next listing/hearing: ${data.listing || "—"}
Last coram: ${data.coram || "—"}

Open next steps:
${data.tasks.length ? data.tasks.map((t) => `- ${t}`).join("\n") : "- none recorded"}

Hearing notes:
${data.notes.length ? data.notes.map((t) => `- ${t}`).join("\n") : "- none recorded"}

${orderBlock || "No order text available."}

Structure:
1. Caption & listing
2. What the last order actually did
3. Issues likely to be called
4. Papers / next steps still open
5. Suggested ask of the Court (one paragraph)

Plain professional English. Do not invent facts that are not in the materials.`;
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 700,
				temperature: .3,
				messages: [{
					role: "user",
					content: prompt
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `Briefing failed (${res.status}).`
		};
		const text = (await res.json()).choices?.[0]?.message?.content?.trim() || "";
		if (!text) return {
			ok: false,
			error: "The model returned an empty brief."
		};
		return {
			ok: true,
			text
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Briefing failed."
		};
	}
});
//#endregion
export { downloadCauselistPdf_createServerFn_handler, draftHearingBrief_createServerFn_handler, fetchCaseTypes_createServerFn_handler, fetchCase_createServerFn_handler, fetchCauselistJudges_createServerFn_handler, fetchOrderPdfs_createServerFn_handler, resolveListing_createServerFn_handler, scanCauselistBatch_createServerFn_handler };
