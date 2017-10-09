// init Map
mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

// specific non-native move into GeolocateControl
class GeolocateControlWrapper extends mapboxgl.GeolocateControl {
  _onSuccess(position) {
    const latLng = [position.coords.latitude, position.coords.longitude]
    moveTo(latLng, 11)
  }
}

map.addControl(new mapboxgl.NavigationControl())
map.addControl(new GeolocateControlWrapper())

// pois
const worker = new Worker('/static/js/webworker-around.js')
let pois = []

function addPoi (poi) {
  const el = document.createElement('div')
  el.classList.add('marker')
  el.id = poi.id

  const marker = new mapboxgl.Marker(el, {offset:[4, -6]})
    // OSM standard [Lng, Lat]
    .setLngLat([poi.location[1], poi.location[0]])
    .addTo(map)

  /* no pois-cards in mobile, using popup */
  if(window.matchMedia('(max-width: 768px)').matches) {
    const popup = new mapboxgl.Popup({offset: [10, 0]})
    .setHTML(`<h2>${poi.name}</h2>
              <ul>
                <li>Wifi quality: ${poi.wifi}</li>
                <li>Power available: ${poi.power}</li>
              </ul>`)
    marker.setPopup(popup)
  }

  const hash = getHash()
  if(hash && hash === el.id) {
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
  const popup = new mapboxgl.Popup({offset: [10, 0]})
    .setHTML('<p>My current location</p>')

  const el = document.createElement('div')
  el.classList.add('marker')
  el.classList.add('current')

  // OSM standard [Lng, Lat]
  new mapboxgl.Marker(el, {offset:[0, -30]})
    .setLngLat([currentLatLng[1], currentLatLng[0]])
    .setPopup(popup)
    .addTo(map)

  if (!window.location.hash) {
    moveTo(currentLatLng, 11)
  }
}

function focusUser (latLng) {
  moveTo(latLng, 11)
  currentMarker(latLng)
}

function moveTo (latLng, zoom) {
  // OSM standard [Lng, Lat]
  map.flyTo({
    center: [latLng[1], latLng[0]],
    zoom: zoom
  })
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
