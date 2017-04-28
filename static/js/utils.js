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
  const avatar = document.getElementById('avatarMenu')
  const menu = document.getElementById('menu')
  avatar.addEventListener('click', appears = _ => {
    menu.classList.toggle('active')
  })
}
