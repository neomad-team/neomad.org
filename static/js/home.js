const button = document.querySelector('#join-us')
let buttonPosition = (button.offsetTop - 15)

function adaptButtonPosition() {
  buttonPosition = (button.offsetTop - 15)
  return buttonPosition
}

function stickyJoinButton(event) {
  
  let diff = (event.pageY-buttonPosition)
  
  if (diff > 0) {
    button.setAttribute('class', 'sticky'); 
  } else {
    button.removeAttribute("class", "sticky"); 
  }
}

window.addEventListener('resize', adaptButtonPosition)

document.addEventListener('scroll', stickyJoinButton)
