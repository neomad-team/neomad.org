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
  avatar.addEventListener('click', function() {
    menu.classList.toggle('active')
  })
}
