// Button position
const button = document.querySelector('#join-us')
let buttonPosition = adaptButtonPosition()

function adaptButtonPosition() {
  return button.offsetTop - 15
}

function stickyJoinButton(event) {
  let diff = (event.pageY - buttonPosition)
  button.classList.toggle('sticky', diff > 0)
}

window.addEventListener('resize', adaptButtonPosition)

window.addEventListener('scroll', stickyJoinButton)
