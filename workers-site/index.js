export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response("Assets not bound", { status: 500 });
    }
    return env.ASSETS.fetch(request);
  }
}

