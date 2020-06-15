window.onload = _ => {
  const menu = document.querySelector('#menu')
  const avatar = document.querySelector('#avatar-menu')
  if (menu && avatar) avatar.addEventListener('click', _ => menu.classList.toggle('active'))
}

function localize() {
  let localizeUserPosition
  const storedPositionJSON = sessionStorage.getItem('currentPosition')

  if (!storedPositionJSON) {
    navigator.geolocation.getCurrentPosition(async currentPosition => {
      const res = await fetch('/trips/add/', {
        method: 'post',
        body: JSON.stringify([currentPosition.coords.latitude, currentPosition.coords.longitude]),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })

      localizeUserPosition = [currentPosition.coords.latitude, currentPosition.coords.longitude]
      sessionStorage.setItem('currentPosition', JSON.stringify(localizeUserPosition))

      if (window.location.pathname === "{{ url_for_trips(current_user) }}" && res.status === 201)
        window.location.reload()
    })
  }
  localizeUserPosition = JSON.parse(storedPositionJSON)

  if (window.location.pathname === "{{ url_for('around') }}")
    moveTo(localizeUserPosition)
  if (window.location.pathname === "{{ url_for('form_spot') }}")
    userPosition = localizeUserPosition
}

function notify(type, message, delay) {
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
