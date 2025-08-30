export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // 默认访问 / 时返回 index.html
    const path = url.pathname === "/" ? "index.html" : url.pathname.slice(1);

    const file = await env.KV.get(path);
    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    // 根据文件类型设置 Content-Type
    const ext = path.split(".").pop();
    const contentType = ext === "html" ? "text/html"
                      : ext === "js" ? "application/javascript"
                      : ext === "css" ? "text/css"
                      : ext === "m3u8" ? "application/vnd.apple.mpegurl"
                      : "application/octet-stream";

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  },
};
