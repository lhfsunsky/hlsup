export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Pages 会自动提供 public/ 下的文件访问
    // 这里我们直接 fetch 自身请求
    const response = await fetch(url.toString());

    // 可以修改响应，例如加 header
    const headers = new Headers(response.headers);
    headers.set("X-Custom-Header", "Hello Worker");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
