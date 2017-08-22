// init Map
const accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
const map = L.map('map', {
  center: [0, 0],
  zoom: 2,
  zoomControl: false,
  layers: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?${''}access_token=${accessToken}`)
})

new L.Control.Zoom({position: 'topright'}).addTo(map)
const localizeUser = L.control.locate({position: 'topright', setView: false}).addTo(map)

const blueIcon = L.icon({
  iconUrl: '/static/images/marker-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -32]
})
const redIcon = {url: '/static/images/marker-red.png'}
const greenIcon = {url: '/static/images/marker-green.png'}

 
// POIS creation
const worker = new Worker('/static/js/webworker-around.js')
let pois = []

function addPoi (poi) {
  const marker = L.marker(poi.location, {icon: blueIcon, alt: poi.name}).addTo(map)
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
    superCard(hash)
    firstCard(hash)
    moveTo(poi.location, 11)
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
  superCard(hash)
}

map.on('click', event => {
  const poi = findPoi(event.originalEvent.target.id)
  if(poi) {
    moveTo(poi.location, 11)
    urlFor(poi.id)
    scrollCard(poi.id)
  }
})

// functions
function currentMarker (currentLatLng) {
  
  localizeUser.start()

  if (!window.location.hash) {
    moveTo(currentLatLng, 11)
  }
}

function focusUser (latLng) {
  moveTo(latLng, 11)
  currentMarker(latLng)
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

function highlight (poi_id) {
  const currentCard = document.querySelector('.current-card')
  const currentMarker = document.querySelector('.current-marker')
  const superMarker = document.querySelector('.super-marker')
  // querySelector don't works if poi_id begin with a number
  const marker = document.getElementById(poi_id)
  const card = document.querySelector(`#card-${poi_id}`)
  if(currentCard) {
    currentCard.classList.remove('current-card')
  }
  if(currentMarker) {
    currentMarker.classList.remove('current-marker')
  }
  if(card) {
    marker.classList.toggle('current-marker')
    card.classList.toggle('current-card')
  }
  superMarker.classList.remove('current-marker')
}

function superCard (poi_id) {
  const superCard = document.querySelector('.super-card')
  const superMarker = document.querySelector('.super-marker')
  // querySelector don't works if poi_id begin with a number
  const selectedMarker = document.getElementById(poi_id)
  const selectedCard = document.querySelector(`#card-${poi_id}`)
  if(superCard) {
    superCard.classList.toggle('super-card')
  }
  if(selectedCard) {
    selectedCard.classList.toggle('super-card')
  }
  if(superMarker) {
    superMarker.classList.toggle('super-marker')
    superMarker.classList.toggle('marker')
  }
  if(selectedMarker) {
    selectedMarker.classList.add('super-marker')
    selectedMarker.classList.remove('current-marker')
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
    formLayer.classList.toggle('visible')
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
