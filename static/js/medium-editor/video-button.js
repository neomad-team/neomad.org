const videoButton = document.querySelector('[data-addon="embeds"]')

if (videoButton) {
  const helperMessage = 'just copy past the youtube link and save as draft to see the result'

  videoButton.setAttribute('title', helperMessage)
  videoButton.addEventListener('click', _ => {
    alert('info', helperMessage)
  })
}
