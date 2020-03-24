const form = document.querySelector('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  if (!userPosition)
    return notify('error', 'You have not allow you location, please change your privacy setting.')

  const formValues = { location: userPosition }
  const data = new FormData(event.target)
  data.forEach((v, k) => formValues[k] = v)

  fetch(event.target.action, {
    method: 'post',
    body: JSON.stringify(formValues),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.redirected) window.location.href = response.url
    else
      notify('error', 'Something went wrong. Please try again later.')
  })
  .catch(e => console.error(e))
})
