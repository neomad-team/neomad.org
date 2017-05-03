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

window.onload = _ => {
  const menu = document.getElementById('menu')
  const avatar = document.getElementById('avatarMenu')
  const main = document.getElementsByTagName('main')
  avatar.addEventListener('mouseenter', open = _ => {
    if (menu.className == 'profile-menu') {
      menu.classList.toggle('active')
    }
  })
  menu.addEventListener('mouseleave', close = _ => {
    if (menu.className == 'profile-menu active') {
      menu.classList.toggle('active')
    }
  })
}
