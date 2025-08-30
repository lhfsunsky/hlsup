export default {
  async fetch(request, env) {
    const html = await env.KV.get("index.html");
    if (!html) return new Response("File not found", { status: 404 });
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  },
};
