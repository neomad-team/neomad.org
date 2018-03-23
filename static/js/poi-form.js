// display form with open/close button
const formLayer = document.querySelector('#poi-form')

document.querySelector('#open-form').addEventListener('click', _ => {
  userID ? formLayer.classList.add('visible')
         : alert('warning', 'Sorry, you need to <a href=/login/>log in</a> to share a place.')
})

document.querySelector('#close-form').addEventListener('click', _ => {
  formLayer.classList.remove('visible')
})

// close form clicking outside form
formLayer.addEventListener('click', event => {
  event.target.classList.remove('visible')
})

// saving/adding a spot
document.querySelector('#poi-form form').addEventListener('submit', event => {
  event.preventDefault()
  const data = new FormData(event.target)
  const formValues = {location: currentLatLng}
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
    if (response.id) {
      alert('success', 'You spot was saved successfully')
    }
    else {
      alert('error', 'Something went wrong. Please try again later.')
    }
    document.querySelector('#poi-form').classList.remove('visible')
    addPoi(response)
  })
  .catch(e => console.error(e))
})
