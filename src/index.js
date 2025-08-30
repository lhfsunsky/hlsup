export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname === "/" ? "index" : url.pathname.slice(1);

    // 列出 KV 所有 keys
    const allKeys = await env.KV.list();
    // 找到匹配 index 开头的文件
    const matchedKey = allKeys.keys.find(k => k.name.startsWith(path));
    if (!matchedKey) return new Response("File not found", { status: 404 });

    const file = await env.KV.get(matchedKey.name);
    return new Response(file, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};


