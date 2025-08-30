const fileMap = {
  'index.m3u8': 'https://i0.hdslb.com/bfs/openplatform/73cb0ffc2cc0d525fa1050dd477377fc54be781d.txt',
  'segment000.ts': 'https://i0.hdslb.com/bfs/openplatform/f62ac80dee6cc01d693c642f5777ba9805fd01c8.txt',
  'segment001.ts': 'https://i0.hdslb.com/bfs/openplatform/e79ce46dd61755c01760ec7cd5ecb76bb68154bc.txt',
  'segment002.ts': 'https://i0.hdslb.com/bfs/openplatform/6f623b670f55b720e5b49c1d44ef44cca98a5491.txt',
  'segment003.ts': 'https://i0.hdslb.com/bfs/openplatform/f180d3fd4b5cbd279f6a783f3e5ef34c74615c35.txt',
  'segment004.ts': 'https://i0.hdslb.com/bfs/openplatform/7acf3ec035c3ebfe91dd77bab2ff60bf16990e3f.txt',
  'segment005.ts': 'https://i0.hdslb.com/bfs/openplatform/6d88555c85b6b34a9429b30e9405f29f0ecaa781.txt',
  'segment006.ts': 'https://i0.hdslb.com/bfs/openplatform/590e66078cae30f14de4a2c7e980dd6672d5840e.txt',
  'segment007.ts': 'https://i0.hdslb.com/bfs/openplatform/363ffb53277ca18ab7835592385ad47cd9a62ac0.txt',
  'segment008.ts': 'https://i0.hdslb.com/bfs/openplatform/f41cc80313725a932c9218670b2dea975acd7ff2.txt',
  'segment009.ts': 'https://i0.hdslb.com/bfs/openplatform/35a7c928008263327f7838ed70ba9d83660879da.txt',
  'segment010.ts': 'https://i0.hdslb.com/bfs/openplatform/8dc792c40104bfaaf80e3a198f7352bb7168b880.txt',
  'segment011.ts': 'https://i0.hdslb.com/bfs/openplatform/71a51e899a65f8d46f73945670cb36de5f340ffd.txt',
  'segment012.ts': 'https://i0.hdslb.com/bfs/openplatform/afa9dc661afc79ce60a3d37576f1d266e8a43db5.txt',
  'segment013.ts': 'https://i0.hdslb.com/bfs/openplatform/e624ccec5f9292dd1b04a71d466cc5e9a490b416.txt',
  'segment014.ts': 'https://i0.hdslb.com/bfs/openplatform/f6be6a46982963a6b93f01b31665b556bf1a07d7.txt',
  'segment015.ts': 'https://i0.hdslb.com/bfs/openplatform/5292c699e244af7c8fa84a5721b93bb276a4fbf4.txt',
  'segment016.ts': 'https://i0.hdslb.com/bfs/openplatform/e0333c01bd456fa9213dcdd81ac640311f9cde13.txt',
  'segment017.ts': 'https://i0.hdslb.com/bfs/openplatform/41673f0921af5f7137aefade6cb54639cb77c1e1.txt',
  'segment018.ts': 'https://i0.hdslb.com/bfs/openplatform/1c6ec02a0f868e4d06eeb769f18e0504baf36bdb.txt',
  'segment019.ts': 'https://i0.hdslb.com/bfs/openplatform/1eecdca8f6c3c250162e44237685e1ef6bf592df.txt',
  'segment020.ts': 'https://i0.hdslb.com/bfs/openplatform/77a01b7e1e5bca18d109ed89675deefbb5e1d62f.txt',
  'segment021.ts': 'https://i0.hdslb.com/bfs/openplatform/d8c1142b7e4526341d77673ce12991bbb5d0384b.txt',
  'segment022.ts': 'https://i0.hdslb.com/bfs/openplatform/5bc7f00bb5fdbe190f106a0a324ef8f07d52ad6d.txt',
  'segment023.ts': 'https://i0.hdslb.com/bfs/openplatform/56b13606536196e5e541820b99a4178e398f2256.txt',
  'segment024.ts': 'https://i0.hdslb.com/bfs/openplatform/7469bb5f065d31de53aefdbd3727a4f641cacbbb.txt',
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
