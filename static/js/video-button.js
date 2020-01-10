const videoButton = document.querySelector('[data-addon="embeds"]')

if (videoButton) {
  const helperMessage = 'Just paste the Youtube URL of your video in the text and save. The video will replace that URL.'

  videoButton.setAttribute('title', helperMessage)
  videoButton.addEventListener('click', _ => {
    notify('info', helperMessage)
  })
}
