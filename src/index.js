export default {
  async fetch(request, env) {
    return env.__my-worker-workers_sites_assets.fetch(request);
  }
};



