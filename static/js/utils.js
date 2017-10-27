function alert(type, message, delay) {
  console.info(type, message)
  let notification = document.querySelector('#notification')
  if(!notification) {
    notification = document.createElement('div')
    notification.id = 'notification'
    document.body.append(notification)
  }
  notification.innerHTML = message
  notification.classList = [type]
  if(delay !== 0) {
    this.timer = setTimeout(_ => {
      notification.classList = []
    }, delay || 5000)
  }
}

function coordinatesToAddress (coordinates) {
  const [lat, lng] = coordinates.split(',')
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
    mode: 'cors'
  })
  .then(r => r.json())
<<<<<<< HEAD
  .then(d => {
    const data = d.address
    data['area'] = data.town || data.village || data.city
    return data
  })
}

function localize(url) {
  navigator.geolocation.getCurrentPosition(position => {
    fetch(url, {
      method: 'post',
      body: JSON.stringify([position.coords.latitude, position.coords.longitude]),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
=======
  .then(d => d.address)
  .catch(console.error.bind(console))
>>>>>>> 9c4c40c29c6629a046c09e3785ba07ea18b97085
}

window.onload = _ => {
  const menu = document.querySelector('#menu')
  if (menu) {
    const avatar = document.querySelector('#avatar-menu')
    avatar.addEventListener('click', _ => {
      menu.classList.toggle('active')
    })
  }
}
