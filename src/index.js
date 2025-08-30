export default {
  async fetch(request, env) {
    // 可以在这里拦截请求，比如添加 header
    const response = await fetch(request);

    // Example: 给所有响应加上安全 header
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Custom-Header", "Hello Worker");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};

