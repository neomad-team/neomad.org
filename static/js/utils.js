function alert (type, message, delay) {
  console.info(`${type}: ${message}`)
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

function apiFeedback (caller, confirmation) {
  return caller.then(response => {
    const status = response.status
    if(200 <= status < 300) {
      alert('success', confirmation)
    }
    else {
      alert('error', `An error occured. Technical detail: response status ${status}`)
      console.error(response)
    }
    return response
  }, error => {
    alert('error', error)
    return error
  })
}

var api = {
  send(method, url, data) {
    return fetch(url, {
      method: method.toUpperCase(),
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}
    })
  }
}

function coordinatesToAddress (coordinates) {
  const [lat, lng] = coordinates.split(',')
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
    mode: 'cors'
  })
  .then(r => r.json())
  .then(d => {
    const data = d.address
    data['area'] = data.town || data.village || data.city
    return data
  })
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
