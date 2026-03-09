import { documents } from "../scripts/knowledge-base";

export interface Env {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  LOAD_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/load" && request.method === "POST") {
      return handleLoad(env, request);
    }

    if (url.pathname === "/query" && request.method === "POST") {
      return handleQuery(request, env);
    }

    return new Response("RAG tutorial worker is running", { status: 200 });
  },
};

async function handleLoad(env: Env, request: Request): Promise<Response> {
  const authHeader = request.headers.get("X-Load-Secret");
  if (authHeader !== env.LOAD_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { id: string; status: string }[] = [];

  for (const doc of documents) {
    const response = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [doc.text],
    }) as { data: number[][] };

    await env.VECTORIZE.upsert([
      {
        id: doc.id,
        values: response.data[0],
        metadata: {
          ...doc.metadata,
          text: doc.text,
        },
      },
    ]);

    results.push({ id: doc.id, status: "loaded" });
  }

  return Response.json({ success: true, loaded: results });
}

async function handleQuery(request: Request, env: Env): Promise<Response> {
  // Guard against malformed request body
  let body: { question: string };
  try {
    body = await request.json() as { question: string };
  } catch {
    return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
  }

  if (!body.question || typeof body.question !== "string" || body.question.trim() === "") {
    return Response.json({ error: "question must be a non-empty string" }, { status: 400 });
  }

  // Sanitize input
  const question = body.question.trim().slice(0, 500);

  // Step 1: Embed the question
  let embeddingResponse: { data: number[][] };
  try {
    embeddingResponse = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [question],
    }) as { data: number[][] };
  } catch (err) {
    console.error("Embedding generation failed:", err);
    return Response.json({ error: "Failed to process your question" }, { status: 503 });
  }

  // Step 2: Search Vectorize
  let searchResults: Awaited<ReturnType<typeof env.VECTORIZE.query>>;
try {
    searchResults = await env.VECTORIZE.query(
      embeddingResponse.data[0],
      {
        topK: 3,
        returnMetadata: "all",
      }
    );
  } catch (err) {
    console.error("Vectorize query failed:", err);
    return Response.json({ error: "Failed to search knowledge base" }, { status: 503 });
  }

  // Step 3: Build context
  const context = searchResults.matches
    .filter((match) => match.score > 0.5)
    .map((match) => match.metadata?.text as string)
    .filter(Boolean)
    .join("\n\n");

  if (!context) {
    return Response.json({
      answer: "I could not find relevant information to answer that question. Try rephrasing or asking something else.",
      sources: [],
    });
  }

  // Step 4: Generate answer
  let aiResponse: { response: string };
  try {
    aiResponse = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Answer the question using only the context provided. If the context does not contain enough information, say so.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      max_tokens: 256,
    }) as { response: string };
  } catch (err) {
    console.error("LLM generation failed:", err);
    return Response.json({ error: "Failed to generate an answer" }, { status: 503 });
  }

  // Step 5: Return answer with sources
  const sources = searchResults.matches
    .filter((match) => match.score > 0.5)
    .map((match) => match.metadata?.source as string)
    .filter(Boolean);

  return Response.json({
    answer: aiResponse.response,
    sources: [...new Set(sources)],
  });
}