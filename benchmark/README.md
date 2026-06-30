# Universal AI Benchmark Package

This folder contains a reproducible benchmark suite for evaluating LLMs across legal reasoning, coding, research, long-context recall, planning, and adversarial robustness.

## Contents

- `generate.mjs` builds 1,014 test cases and hidden answer keys.
- `run.mjs` executes a model against the public benchmark through an OpenAI-compatible API.
- `evaluate.mjs` scores model outputs against the hidden keys and exports reports.
- `output/` contains generated JSONL/JSON/CSV/Markdown/HTML artifacts.

## Categories

The suite covers:

- Labour Law
- Employment Law
- HR Compliance
- EPF
- ESIC
- Minimum Wages
- Bonus
- Gratuity
- POSH
- Contract Labour
- Industrial Relations
- GeM Procurement
- Government Contracts
- Tender Evaluation
- Criminal Law
- Civil Law
- Constitutional Law
- Logical Reasoning
- Mathematics
- Coding
- Scientific Reasoning
- Long Context
- Reading Comprehension
- Research
- Planning
- Decision Making

## Quick Start

```bash
npm run bench:generate
npm run bench:run -- --model gpt-4o-mini
npm run bench:evaluate -- --predictions benchmark/output/runs/latest.jsonl
```

## Design

- Public benchmark cases are separated from hidden answer keys.
- Long-context tasks are generated from deterministic context recipes instead of storing enormous static files.
- Research tasks can optionally fetch official sources through the runner.
- Scoring is rubric-based and produces 0-100 subscores for accuracy, reasoning, citation quality, hallucination resistance, tool use, planning, consistency, latency, safety, honesty, and overall intelligence.
