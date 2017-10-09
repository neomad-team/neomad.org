function alert(type, message, delay) {
  console.info(type, message)
  let notification = document.querySelector('#notification')
  if(!notification) {
    notification = document.createElement('div')
    notification.id = 'notification'
    document.body.append(notification)
  }
  notification.textContent = message
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
  .then(d => {
    const data = d.address
    data['area'] = data.town || data.village || data.city
    return data
  })
}

window.onload = _ => {
  // section poisCards hidden marker overflow
  if(window.location.href.includes('around')) {
    const canvas = document.querySelector('canvas')
    const poisCards = document.querySelector('#poi-cards')
    poisCards.style.minHeight = `${canvas.height}px`

    const displayForm = document.querySelectorAll('.display-form')
    displayForm.forEach( button => {
      button.addEventListener('click', _ => {
        const poiForm = document.querySelector('#poi-form')
        poiForm.classList.toggle('visible')
      })
    })
  }

  const menu = document.querySelector('#menu')
  const avatar = document.querySelector('#avatar-menu')
  avatar.addEventListener('click', _ => {
    menu.classList.toggle('active')
  })
}
