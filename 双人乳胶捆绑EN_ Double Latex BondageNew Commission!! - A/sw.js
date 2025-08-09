const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/8385deaf5db8341f2eceb36cc3b116fc0ad384a4.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/98bf17bbd8635dc2121c75b9476efea02a02e440.txt',
};
self.addEventListener('install', event => {
  console.log('[ServiceWorker] 安装');
  // 跳过等待，立刻进入激活阶段
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] 激活');
  // 立即接管所有页面
  event.waitUntil(self.clients.claim());
});

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
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'skipWaiting') {
    console.log('[ServiceWorker] 收到 skipWaiting 消息');
    self.skipWaiting();
  }
});