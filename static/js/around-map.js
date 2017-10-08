// POIS creation
const worker = new Worker('/static/js/webworker-around.js')
let pois = []

function addPoi (poi) {
  const marker = L.marker(poi.location, {icon: markerIcon, alt: poi.name}).addTo(map)
  marker._icon.setAttribute('id', poi.id)

  // no pois-cards in mobile, using popup
  if(window.matchMedia('(max-width: 768px)').matches) {
    const popup = L.popup()
    .setContent(`<h2>${poi.name}</h2>
              <ul>
                <li>Wifi quality: ${poi.wifi}</li>
                <li>Power available: ${poi.power}</li>
              </ul>`)
    marker.bindPopup(popup)
  }

  const hash = getHash()
  if(hash && hash === marker._icon.id) {
    hashCard(hash)
    firstCard(hash)
    moveTo(poi.location, 13)
  }
}

worker.addEventListener('message', r => {
  pois = r.data
  r.data.forEach(addPoi)
})
worker.postMessage('')

// events
window.onhashchange = _ => {
  const hash = getHash()
  hashCard(hash)
}

map.on('click', event => {
  const poi = findPoi(event.originalEvent.target.ownerDocument.activeElement.id)
  if(poi) {
    moveTo(poi.location)
    urlFor(poi.id)
    scrollCard(poi.id)
  }
})

// functions
function currentMarker (currentLatLng) {
  
  localizeUser.start()

  if (!window.location.hash) {
    moveTo(currentLatLng, 13)
  }
}

function moveTo (latLng, zoom) {
  map.flyTo(latLng, zoom)
}

function getHash () {
  return window.location.hash.slice(1)
}

function urlFor (id) {
  window.location.hash = id
}

function findPoi (id) {
  return pois.find(poi => poi.id === id)
}

function getTwins (poi_id) {
  // querySelector don't works if poi_id begin with a number
  const marker = document.getElementById(poi_id)
  const card = document.querySelector(`#card-${poi_id}`)
  return twins = [
    {class: 'marker', div: marker},
    {class: 'card', div: card}
  ]
}

function highlight (poi_id) {
  document.querySelectorAll('.marker').forEach(marker => {
    marker.classList.add('not-current-marker')
  })
  getTwins(poi_id).forEach(el => {
    el.div.classList.add(`current-${el.class}`)
  })
}
function delight (poi_id) {
  document.querySelectorAll('.marker').forEach(marker => {
    marker.classList.remove('not-current-marker')
  })
  getTwins(poi_id).forEach(el => {
    el.div.classList.remove(`current-${el.class}`)
  })
}

function hashCard (poi_id) {
  const hashCard = document.querySelector('.hash-card')
  const superMarker = document.querySelector('.hash-marker')
  // querySelector don't works if poi_id begin with a number
  const selectedMarker = document.getElementById(poi_id)
  const selectedCard = document.querySelector(`#card-${poi_id}`)
  if(hashCard) {
    hashCard.classList.toggle('hash-card')
  }
  if(selectedCard) {
    selectedCard.classList.toggle('hash-card')
  }
  if(superMarker) {
    superMarker.classList.toggle('hash-marker')
    superMarker.classList.toggle('marker')
  }
  if(selectedMarker) {
    selectedMarker.classList.add('hash-marker')
    selectedMarker.classList.remove('current-marker')
    selectedMarker.classList.remove('not-current-marker')
    selectedMarker.classList.remove('marker')
  }
}

function firstCard (poi_id) {
  const hashCard = document.querySelector(`#card-${poi_id}`)
  if(hashCard) {
    hashCard.classList.toggle('first-card')
  }
}

function scrollCard (poi_id) {
  const card = document.querySelector(`#card-${poi_id}`)
  const cardTop = card.offsetTop
  const cardHeight = card.offsetHeight
  window.scrollTo(0, (cardTop - cardHeight/2))
}

// form

// display form with open/close button
const formLayer = document.querySelector('#poi-form')
const displayForm = document.querySelectorAll('.display-form')
displayForm.forEach(button => {
  button.addEventListener('click', _ => {
    if (userID) {
      formLayer.classList.toggle('visible')
    } else {
      alert('error', 'Sorry, you need to be logged to share a place <a href#>login you</a>')
    }
  })
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
      alert('success', 'You spot was saved succefully')
    }
    else {
      alert('error', 'Something went wrong. Please try again later.')
    }
    document.querySelector('#poi-form').classList.remove('visible')
    addPoi(response)
  })
})
