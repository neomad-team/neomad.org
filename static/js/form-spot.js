const form = document.querySelector('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  /** user location value defined from template */
  const location = userLocation
  if (!location)
    return notify('error', 'You have not allow you location, please change your privacy setting.')

  const formValues = { location }
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
      ? notify('success', 'You spot was saved successfully, thanks!')
      : notify('error', 'Something went wrong. Please try again later.')
  })
  .catch(e => console.error(e))
})
