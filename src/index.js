export default {
  async fetch(request, env) {
    return env.MY_SITE_ASSETS.fetch(request);
  }
};



