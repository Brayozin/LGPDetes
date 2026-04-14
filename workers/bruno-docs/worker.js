export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const assetUrl = new URL("/index.html", url);
      const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));

      if (!assetResponse.ok) {
        return assetResponse;
      }

      const html = await assetResponse.text();
      const rewrittenHtml = html
        .replace("name: local", "name: production")
        .replaceAll("http://localhost:3000", "https://lgpd.brayozin.dev");

      const headers = new Headers(assetResponse.headers);
      headers.set("content-type", "text/html; charset=utf-8");

      return new Response(rewrittenHtml, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers
      });
    }

    return env.ASSETS.fetch(request);
  }
};
