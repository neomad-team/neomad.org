const button = document.querySelector('#join-us')

if (button) {
  window.addEventListener('scroll', event => {
    const diff = (event.currentTarget.pageYOffset - button.offsetTop + 13)
    button.classList.toggle('sticky', diff > 0)
  })
}
