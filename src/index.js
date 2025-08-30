export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname === "/" ? "index.html" : url.pathname.slice(1);

    const file = await env.KV.get(path);
    if (!file) {
      return new Response("File not found: " + path, { status: 404 });
    }

    return new Response(file, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};

