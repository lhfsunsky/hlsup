import indexHtml from "../public/index.html?raw";

export default {
  async fetch(request, env) {
    return new Response(indexHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

