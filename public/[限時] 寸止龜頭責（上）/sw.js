const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/229710d821e1ad78b37bacacad0c7fd2bdc1929b.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/981ae830ca3022f6dc62e4153903a2f259c0fc18.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/c3e310998b92d255b2707ea7f8696f8075eb17be.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/bccbb4024c915529ab22be3a02c855dabb9ddcd3.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/b6735bc7c829fbb508cbf3a1608a07f892ffe5fe.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/6797a51e23516b66c38ca2fcf0eb2468fd8084b0.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/a8c92e2f5b35a85ebe5cef4b867e5cadacf7b3cf.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/b3ae1909e41f34ccd0b88b75e95d8f6d15b33cd5.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/92d2c340afb6a6eaf0db83de2a3e3451181ad9ca.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/3e5504cb12fa7aaae2ff31f0e487802fae951293.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/31b4709d00292d1fff142a953dcfa699eab29237.txt',
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
