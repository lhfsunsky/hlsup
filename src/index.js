export default {
  async fetch(request, env) {
    return env.__STATIC_CONTENT.fetch(request);
  }
};


