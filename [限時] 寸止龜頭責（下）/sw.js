const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/415da8f416053e8adc6aa8996f1511ffb8a2af8d.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/0e9647a4489ff97e87bc9e8d4269e532fcd60a25.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/918d3ad2e2fb45b6a58efd941368d0df2831f170.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/96f4d7b00bd127f0a12c6d1f2f717efdee61c426.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/642f2f2cb43daada27cceec00d91e6906f1d0e57.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/c40c339893880b8ecf8abccc886350655d6bcfe0.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/35a4046efdd4c6ce7b79b0eaa6158661e65b0135.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/0f31b1c3d13b80ed77a146fd1d43bb062ec33ced.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/0701d66edb9a5b367de8a7a51e9bf405da09d99e.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/f272276929885fe9fa938833730c624ea57de2a0.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/b0fe5cf320825398854e765919cad867a03915ac.txt',
  'segment010.ts': 'https://i0.hdslb.com/bfs/openplatform/6b301a3aa215b935653f2535f15378185de3f7b5.txt',
  'segment011.ts': 'https://i0.hdslb.com/bfs/openplatform/fd69d5a61cb79ad1e52c494c7c0b42b9adbc7cd7.txt',
  'segment012.ts': 'https://i0.hdslb.com/bfs/openplatform/7c80f183cd600982f2d771826b14e8e2121f3b76.txt',
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
