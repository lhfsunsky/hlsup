const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/c3441dbb8290ff0f0b47e5368a6d0dfc6b722384.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/00cf43773ecb1ec2db546203af6ea4b79d371afc.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/ae65fb5b8e296d991c6bfc9188c8be1885aa0220.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/dc0ad92f2314e03bdca42e50883f05f7e6d9f600.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/3af0c85550b57ffc105d0458202b460a6b8cb41d.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/6acb0dcd78755cbc7863f633c1f69d6f8f9744c4.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/5bb1e1e0018ac7fb44fc9b601b959ae9feea18fb.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/d07516e2dcd8a9bb90462acf42f53cf839df71a7.txt',
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
