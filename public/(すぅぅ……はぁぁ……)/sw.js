const fileMap = {

  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/48ff75826051e2878090db549c4bd50399573273.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/713ab93a1c2b099136916d61011d9d15af2efff4.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/76d40e69621a6cd1e50cbbdd9427838b86b66435.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/ee9b4b5c832dd33ff93f16aba3e9ab0f96d5927c.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/b62067f10ce2f992d9f1d85b351277bc9682abb3.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/34c3bf7f7e7717cc727d746d81854e2e589425d5.txt',
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
