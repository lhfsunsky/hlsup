const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/7dc7c322b8932cbf24277e409306c84e8648d3d2.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/722185361e2924d53702f15238a30a2a45d91bae.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/edfe7e8fe978c60111d36f76b222cdd3246d3663.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/9d5ba50f2e4a7378ce995ca3732053cee1d51c66.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/1ea3a005ff1730c4e92c1c8942361203fc630dbb.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/5078dfed43d6d5110e760ff030367d878841f32c.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/f2aa77e1c87e4a89f0938a6cb33fbd8a699796d7.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/7b21cfdf2ff9c1eb6be15b8c2b859740db71cd8b.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/486f7534ecb5bfff17ecf574f6b6361b71eb519a.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/48319b99a2cd30b8a0958fae55909ee2f8427355.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/bd8b1a443ac4f243962d9d9861db5ddd3166a117.txt',
  'segment010.ts': 'https://i0.hdslb.com/bfs/openplatform/3181b42b04ddfe3d66900dfab44a22d99a48bb87.txt',
  'segment011.ts': 'https://i0.hdslb.com/bfs/openplatform/c7f03335dbe5d5b7d8a3109e59cb92e2bff319f5.txt',
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
