export default {
  async fetch(request) {
    return new Response("Hello Worker!", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
