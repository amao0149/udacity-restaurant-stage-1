(function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('register success')
  }).catch((err) => {
    console.log(err)
  })
})()