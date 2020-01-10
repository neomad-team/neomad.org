window.onload = _ => {
  const menu = document.querySelector('#menu')
  const avatar = document.querySelector('#avatar-menu')
  if (menu && avatar ) avatar.addEventListener('click', _ => menu.classList.toggle('active'))
}

function notify (type, message, delay) {
  console.info(type, message)
  let notification = document.querySelector('#notification')
  if (!notification) {
    notification = document.createElement('div')
    notification.id = 'notification'
    document.body.append(notification)
  }

  notification.innerHTML = message
  notification.classList = [type]

  if (delay !== 0) {
    this.timer = setTimeout(_ => {
      notification.classList = []
    }, delay || 5000)
  }
}

function getPosition() {
  return new Promise(resolve => {
    const fail = _ => {
      notify('error', 'You geolocalisation went wrong, please try again.')
      resolve([])
    }

    const success = position => {
      const { latitude, longitude } = position.coords
      resolve([latitude, longitude])
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    navigator.geolocation.getCurrentPosition(success, fail, options)
  })
}
