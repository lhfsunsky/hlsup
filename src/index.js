export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // 默认访问 / 时返回 index.html
    const path = url.pathname === "/" ? "index.html" : url.pathname.slice(1);

    // 从 KV 获取文件
    const file = await env.KV.get(path);
    if (!file) {
      return new Response("File not found: " + path, { status: 404 });
    }

    // 根据文件扩展名设置 Content-Type
    const ext = path.split(".").pop();
    const contentType =
      ext === "html" ? "text/html" :
      ext === "css" ? "text/css" :
      ext === "js" ? "application/javascript" :
      ext === "m3u8" ? "application/vnd.apple.mpegurl" :
      "application/octet-stream";

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  },
};
