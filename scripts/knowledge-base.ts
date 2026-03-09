export const documents = [
    {
      id: "1",
      text: "Cloudflare Workers run JavaScript at the edge, in over 300 data centers worldwide. Requests are handled close to the user, reducing latency significantly compared to a single-region server.",
      metadata: { source: "cloudflare-docs", category: "workers" },
    },
    {
      id: "2",
      text: "Vectorize is Cloudflare's vector database. It stores embeddings and lets you search them by semantic similarity. It runs in the same network as your Worker, so there is no external API call needed.",
      metadata: { source: "cloudflare-docs", category: "vectorize" },
    },
    {
      id: "3",
      text: "Workers AI lets you run machine learning models directly on Cloudflare's infrastructure. You can generate embeddings and run LLM inference without leaving the Cloudflare network.",
      metadata: { source: "cloudflare-docs", category: "workers-ai" },
    },
    {
      id: "4",
      text: "RAG stands for Retrieval Augmented Generation. Instead of relying only on what the LLM was trained on, RAG retrieves relevant context from a knowledge base and adds it to the prompt before generating an answer.",
      metadata: { source: "ai-concepts", category: "rag" },
    },
    {
      id: "5",
      text: "An embedding is a numerical representation of text. Similar pieces of text produce similar embeddings. This is what makes semantic search possible — you search by meaning, not exact keywords.",
      metadata: { source: "ai-concepts", category: "embeddings" },
    },
    {
      id: "6",
      text: "The BGE model (bge-base-en-v1.5) is available through Workers AI. It generates 768-dimensional embeddings and works well for English semantic search tasks.",
      metadata: { source: "cloudflare-docs", category: "workers-ai" },
    },
    {
      id: "7",
      text: "Cosine similarity measures the angle between two vectors. For text embeddings, it captures semantic similarity regardless of text length, which makes it more reliable than Euclidean distance.",
      metadata: { source: "ai-concepts", category: "embeddings" },
    },
    {
        id: "8",
        text: "Cloudflare Workers have a free tier that includes 100,000 requests per day. Vectorize requires the Workers Paid plan, which starts at $5/month and includes a generous allocation of vector dimensions before any additional charges apply.",
        metadata: { source: "cloudflare-docs", category: "pricing" },
      },
  ];