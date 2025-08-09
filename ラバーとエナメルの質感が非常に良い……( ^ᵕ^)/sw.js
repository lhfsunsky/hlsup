const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/2d725d4917651a367c7db1db8743e193533d0609.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/064ab0a08eba1705dcef1ee785343d06ea2ab32f.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/fa2114d643c5545164e68e9ba9670a7564551163.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/b3d15c2952ca334aa15f300835462a12f948151b.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/1cd79a1d331026d8db5b505eec7ee1b1ba32fd90.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/f6514b1c99f396244ac9d65398bcaa963d088c46.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/5058100d183d348629ac3805bb9441875f570018.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/033c8d608188a4687148b505f8bc44cc7036b9ed.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/01c56636c4c5d99cab34efe655a2441e984c2eb3.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/f4ee180477d2824bfd37912ecd9de9f3a2f3f8f8.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/15f5164fad4d3f65cbb03434383c90c3e02c3c73.txt',
  'segment010.ts': 'https://i0.hdslb.com/bfs/openplatform/969428fdd3bc602d56440c99a545a0c83ea6de73.txt',
  'segment011.ts': 'https://i0.hdslb.com/bfs/openplatform/970ec647e9d9ad0b502705941bbeeaf529e22ccf.txt',
  'segment012.ts': 'https://i0.hdslb.com/bfs/openplatform/ee34306470bdc8bb0dcb3106be2417b2a3e2eb04.txt',
  'segment013.ts': 'https://i0.hdslb.com/bfs/openplatform/00a4d198aada9958aacb0d15d15e38c7ac5a139b.txt',
  'segment014.ts': 'https://i0.hdslb.com/bfs/openplatform/90b343ee5b7e389bc81b497111737ee110d0f64a.txt',
  'segment015.ts': 'https://i0.hdslb.com/bfs/openplatform/8aaab2668c17d7e848270e0530d04fb093db7a37.txt',
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
