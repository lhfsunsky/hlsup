const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/2c24eae8a042bb92bf7aa67372a078bf8d48b3d8.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/cc71c17986fef484d6e05404873d97d9c49754f6.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/f40627a9d58877ca1668ef5bb8ffe64559e960eb.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/34f85bed07049969498b425a88d97c89de29befe.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/6450c2251f8d18ef6b833f050cd48d6cb4fd60f5.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/92f1293bac6e05762f8db62372798ec18185ed36.txt',
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
