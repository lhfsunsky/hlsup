const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/e32dcc61a7f30cc59b387d9f740211594729e863.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/a044d099c0b6c37ea1141d1803b4929317d57c2e.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/739c3fcf572e79265385d498be09c64c7e8b9379.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/f276d3f20cedc04399c6f2ddbe3ed43ca9e85868.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/bb5ea098c7c3c8089560abb45742332a2018eedf.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/0eb6a4c56bd569a87b0f08b5ad5a7cab5364a1db.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/2d5e82eae67a39fcd263be0a065ff1a8062abb26.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/6eb98a5e997fed0fd4be990f4f410134d6d6ff9b.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/961c6ce6a8180a887346d994332a912a974ab5c9.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/4e829e2cdbe403eeb26ade08711e66f9e156faae.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/6b0adacd2c47f2237fa3db237adf25a3974f461c.txt',
  'segment010.ts': 'https://i0.hdslb.com/bfs/openplatform/9c880bec33b0c35d908a27aba04c70f47a0f1058.txt',
  'segment011.ts': 'https://i0.hdslb.com/bfs/openplatform/7f4c117dfb8be926350e261853ff7ea92324f86e.txt',
};


self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  if (pathname.endsWith('.ts') || pathname.endsWith('.m3u8')) {
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    const mappedFilename = fileMap[filename];
    if (!mappedFilename) {
      event.respondWith(fetch(event.request));
      return;
    }

    // 通过 Flask 代理请求实际的 base64 txt 文件
    const proxyUrl = `https://flask.sunsky62.space/${mappedFilename}`;

    event.respondWith(
      fetch(proxyUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch ${proxyUrl}`);
          return res.text();
        })
        .then(base64data => {
          const rawData = atob(base64data);

          if (filename.endsWith('.m3u8')) {
            return new Response(rawData, {
              headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
            });
          } else {
            const len = rawData.length;
            const arrayBuffer = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              arrayBuffer[i] = rawData.charCodeAt(i);
            }
            return new Response(arrayBuffer.buffer, {
              headers: { 'Content-Type': 'video/MP2T' }
            });
          }
        })
        .catch(err => {
          console.error('Service Worker fetch error:', err);
          return fetch(event.request);
        })
    );
  }
});
