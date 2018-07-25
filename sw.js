const staticCacheName = 'restaurant-v1'
let staticCache = null

const sources = [ // 如何自动维护这些缓存资源？ && 如何选择是否动态加载cache，这个项目中index.html和restaurant.html各注册一个sw是否可取？
  '/',
  '/restaurant.html',
  '/css/styles.css',
  '/js/dbhelper.js',
  '/js/main.js'
]

self.addEventListener('install', (event) => {
  // self.skipWaiting()

  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      staticCache = cache
      return cache.addAll(sources)
    })
  )
})


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(
          name => (name.startsWith('restaurant') && (name !== staticCacheName))
        ).map(toDelete => {
          return caches.delete(toDelete)
        })
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  const requestUrl = new URL(event.request.url)
  if (
    (requestUrl.origin === location.origin) &&
    (requestUrl.pathname === '/restaurant.html')
  ) {
    event.respondWith(
      caches.match('/restaurant.html')
    )
    return
  }

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response

      // 非页面公共asset采用动态加载，第二次才能使用
      if (!staticCache) return
      return fetch(request).then((httpRes) => {
        if (httpRes.ok) {
          staticCache.add(request, httpRes)
        }
        return httpRes
      })
    })
  )
})