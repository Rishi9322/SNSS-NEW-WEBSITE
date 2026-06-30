import fs from "fs/promises";
import path from "path";
import {
  OUTPUT_DIR,
  ensureOutputDir,
  readJsonl,
  writeJsonl,
  nowIso,
  estimateTokens,
  normalize,
} from "./lib.mjs";

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.LLM_BASE_URL || "https://api.openai.com/v1",
    apiKey: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "",
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    cases: path.join(OUTPUT_DIR, "cases.public.jsonl"),
    output: path.join(OUTPUT_DIR, "runs", "latest.jsonl"),
    concurrency: Number(process.env.BENCH_CONCURRENCY || 2),
    limit: Number(process.env.BENCH_LIMIT || 0),
    temperature: Number(process.env.BENCH_TEMPERATURE || 0.2),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === "--base-url" && next) args.baseUrl = next;
    if (token === "--api-key" && next) args.apiKey = next;
    if (token === "--model" && next) args.model = next;
    if (token === "--cases" && next) args.cases = next;
    if (token === "--output" && next) args.output = next;
    if (token === "--concurrency" && next) args.concurrency = Number(next);
    if (token === "--limit" && next) args.limit = Number(next);
    if (token === "--temperature" && next) args.temperature = Number(next);
  }

  if (!args.baseUrl.endsWith("/v1")) {
    args.baseUrl = args.baseUrl.replace(/\/+$/, "");
    if (!args.baseUrl.endsWith("/v1")) args.baseUrl = `${args.baseUrl}/v1`;
  }

  return args;
}

function expandLongContext(caseRecord) {
  const spec = caseRecord.contextSpec;
  if (!spec) return "";

  const intro = [
    "Document Title: Synthetic long-context policy file",
    `Context Seed: ${spec.seed}`,
    `Target Tokens: ${spec.targetTokens}`,
    `Contradiction Type: ${spec.contradictionType}`,
    "",
  ].join("\n");

  const blockA = [
    "Section 1: Core policy statement",
    "The system is governed by version 1 of the policy.",
    "Refunds are permitted within 30 days.",
    "Remote work is allowed twice per week.",
    "Goggles are mandatory in all lab tasks.",
    "",
  ].join("\n");

  const contradictionLines = {
    "policy-window": "Revision note: Refunds are permitted within 14 days.",
    "version-order": "Version 4 supersedes every prior version and is the latest instruction.",
    "summary-vs-body": "Summary: Remote work is prohibited.",
    "safety-protocol": "Appendix: Goggles are optional for the same task.",
    "latest-instruction": "Later update: The later dated instruction overrides the earlier clause.",
  };

  const filler = [
    "Implementation note: Verify the current clause before acting.",
    "Audit note: Keep the written record for reference.",
    "Exception handling: If a later note conflicts, the later note governs.",
    "Operational guidance: Escalate contradictions for review.",
    "Administrative reminder: Always compare the summary with the body.",
    "",
  ].join("\n");

  let text = intro + blockA;
  const targetChars = Math.max(8000, Math.round(spec.targetTokens * 4));
  while (estimateTokens(text) < spec.targetTokens) {
    text += filler;
    if (text.length > targetChars / 2 && contradictionLines[spec.contradictionType]) {
      text += `\n${contradictionLines[spec.contradictionType]}\n`;
    }
  }

  return text;
}

function buildPrompt(caseRecord) {
  const sections = [
    "You are being evaluated on accuracy, reasoning, honesty, and instruction following.",
    "Answer the user's question directly and do not invent citations.",
  ];

  if (caseRecord.category === "Long Context" && caseRecord.contextSpec) {
    sections.push(`CONTEXT:\n${expandLongContext(caseRecord)}`);
  }

  if (caseRecord.requiresWebSearch) {
    sections.push("If you use search, cite the most authoritative source available and say when you cannot verify a claim.");
  }

  sections.push(`QUESTION:\n${caseRecord.question}`);
  return sections.join("\n\n");
}

async function callOpenAICompatible({ baseUrl, apiKey, model, prompt, temperature }) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Answer precisely and avoid fabrication." },
        { role: "user", content: prompt },
      ],
      temperature,
      max_tokens: 1200,
      stream: false,
    }),
  });

  const raw = await response.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    json = { raw };
  }

  return {
    ok: response.ok,
    status: response.status,
    json,
    raw,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureOutputDir();
  await fs.mkdir(path.dirname(args.output), { recursive: true });

  const cases = await readJsonl(args.cases);
  const selected = args.limit > 0 ? cases.slice(0, args.limit) : cases;
  const outputs = [];

  let cursor = 0;
  async function worker() {
    while (cursor < selected.length) {
      const current = cursor;
      cursor += 1;
      const caseRecord = selected[current];
      const prompt = buildPrompt(caseRecord);
      const start = Date.now();
      let result;
      try {
        result = await callOpenAICompatible({
          baseUrl: args.baseUrl,
          apiKey: args.apiKey,
          model: args.model,
          prompt,
          temperature: args.temperature,
        });
      } catch (error) {
        result = {
          ok: false,
          status: 0,
          json: { error: String(error?.message || error) },
          raw: "",
        };
      }
      const latencyMs = Date.now() - start;
      const content =
        result.json?.choices?.[0]?.message?.content ||
        result.json?.choices?.[0]?.text ||
        result.json?.error ||
        result.raw ||
        "";
      const usage = result.json?.usage || {};
      outputs.push({
        id: caseRecord.id,
        category: caseRecord.category,
        model: args.model,
        ok: result.ok,
        status: result.status,
        latencyMs,
        promptTokens: usage.prompt_tokens ?? estimateTokens(prompt),
        completionTokens: usage.completion_tokens ?? estimateTokens(content),
        totalTokens: usage.total_tokens ?? estimateTokens(prompt) + estimateTokens(content),
        prompt,
        response: content,
        timestamp: nowIso(),
      });
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, args.concurrency) }, () => worker()));
  outputs.sort((a, b) => a.id.localeCompare(b.id));
  await writeJsonl(args.output, outputs);
  console.log(JSON.stringify({ output: args.output, cases: outputs.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
