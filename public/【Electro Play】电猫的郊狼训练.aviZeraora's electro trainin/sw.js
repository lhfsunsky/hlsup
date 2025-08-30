const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/ca1f75565714fb6f3ea1d4bc2be82d7a15e8ca3d.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/59012e65bd266ed1408e15767361610876145610.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/fe3d4d6f0d0536cefd8114a3a474c65d11db4d68.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/485701e98505dd14341b0465c660e41637b9ee60.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/53ad00040ba912b63a52e82dd75aa409afb64132.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/e674a7eaa7925afcc81dae85a0b2755e6ad8cc79.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/9d8280e5e26d9931e3c28ec7b252dee4dc08bced.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/1093730474e32f080e8d62a0ebcea699a0d8eba8.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/c15a07c9a8d6ad381a0588c2c440a1bfb178fe43.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/458c4ed10311b0eef0b7960a03bd5c6be4531c65.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/6245d2eddff578096f482c0870334b894ac6223b.txt',
  'segment010.ts': 'https://i0.hdslb.com/bfs/openplatform/935120b5e60465b63837a588ec1304b16db00886.txt',
  'segment011.ts': 'https://i0.hdslb.com/bfs/openplatform/167372f0f68b83f8c351162f0df2bea46fd6b158.txt',
  'segment012.ts': 'https://i0.hdslb.com/bfs/openplatform/583553de324dbf01b6102f400e507c06b7484bd1.txt',
  'segment013.ts': 'https://i0.hdslb.com/bfs/openplatform/16219044bc646a0fcf93b8e37acf81da436b03dd.txt',
  'segment014.ts': 'https://i0.hdslb.com/bfs/openplatform/67049616591f00cacec802eeecddeb750e3bc45d.txt',
  'segment015.ts': 'https://i0.hdslb.com/bfs/openplatform/85d60d66aed0eff4f10587cf3adfd846cd09de50.txt',
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
