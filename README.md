# rag-tutorial-simple

A production-ready RAG (Retrieval Augmented Generation) system built on Cloudflare Workers, Vectorize, and Workers AI.

Built as the companion repo for the freeCodeCamp tutorial: **How to Build a Production RAG System with Cloudflare Workers**.

## Stack

- **Cloudflare Workers** — edge runtime, no servers
- **Cloudflare Vectorize** — vector database, co-located with the Worker
- **Workers AI** — embeddings (`bge-base-en-v1.5`) and LLM (`llama-3.3-70b-instruct-fp8-fast`)
- **TypeScript**

## Deploy in 5 commands
```bash
git clone https://github.com/dannwaneri/rag-tutorial-simple
cd rag-tutorial-simple
npm install
npx wrangler vectorize create rag-tutorial-index --dimensions=768 --metric=cosine
npx wrangler secret put LOAD_SECRET
npx wrangler deploy
```

## Endpoints

- `GET /` — health check
- `POST /load` — load knowledge base into Vectorize (requires `X-Load-Secret` header)
- `POST /query` — ask a question, get a grounded answer with sources

## Production system

This tutorial is based on [vectorize-mcp-worker](https://github.com/dannwaneri/vectorize-mcp-worker) — the full production version with hybrid search, multimodal support, reranking, and a live dashboard.