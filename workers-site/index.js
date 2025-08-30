export default {
  async fetch(request, env, ctx) {
    return env.ASSETS.fetch(request);  // 把请求交给静态资源处理
  }
}
