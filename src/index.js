export default {
  async fetch(request, env) {
    // Pages 会自动处理 public 下的文件
    return await env.__STATIC_CONTENT.fetch(request);
  }
};
