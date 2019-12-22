const form = document.querySelector('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  /** user location value defined from template */
  const formValues = { location: userLocation }
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
  .then(r => r.json())
  .then(response => {
    response.id
      ? alert('success', 'You spot was saved successfully, thanks!', 5)
      : alert('error', 'Something went wrong. Please try again later.')
  })
  .catch(e => console.error(e))
})
