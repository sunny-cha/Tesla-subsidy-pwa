// 캐시 이름: index.html/manifest.json 수정 배포 시마다 버전을 올려야 기존 방문자에게 즉시 반영됨
const CACHE_NAME = 'tesla-subsidy-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['index.html', 'manifest.json']);
    })
  );
  // 설치 즉시 대기 단계를 건너뛰고 활성화 시킴
  self.skipWaiting();
});

// 활성화 시 이전 버전 캐시를 모두 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
