let userPosition = []
// init Map
mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})
map.addControl(new mapboxgl.NavigationControl())
map.addControl(new mapboxgl.GeolocateControl())

// pois
const worker = new Worker('/static/js/webworker-around.js')

worker.addEventListener('message', response => {
  pois = response.data
  pois.forEach(poi => {
    const el = document.createElement('div')
    el.classList.add('marker')
    el.id = poi._id

    let popup = new mapboxgl.Popup({offset: [10, 0]})
    if(poi.comments.length === 0 || poi.comments[0] == [""]) {
      popup.setHTML(`<h2>${poi.name}</h2>`)
    } else {
      popup.setHTML(`<h2>${poi.name}</h2>
                    <h3>Comments:</h3>
                    <p>${poi.comments}</p>`)
    }

    const marker = new mapboxgl.Marker(el, {offset:[4, -6]})
      // OSM standard [Lng, Lat]
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)

    if(window.location.hash) {
      const hash = getHash()
      if(hash === el.id) {
        masterCard(hash)
        firstCard(hash)
        moveTo([poi.position.latitude, poi.position.longitude], 11)
      }
    }
  })
})

worker.postMessage('')

// event
window.onhashchange = _ => {
  const hash = getHash()
  masterCard(hash)
}

window.onload = _ => {
  // section poisCards hidden marker overflow
  const canvas = document.querySelector('canvas')
  const poisCards = document.querySelector('#poi-cards')
  poisCards.style.minHeight = `${canvas.height}px`
}

map.on('click', event => {
  const poi = findPoi(event.originalEvent.target.id)
  if(poi) {
    moveTo([poi.position.latitude, poi.position.longitude], 11)
    urlFor(poi._id)
  }
})

// functions
function currentMarker (currentLatLng) {
  const popup = new mapboxgl.Popup({offset: [10, 0]})
    .setText('Your current location')

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
  return pois.find(poi => poi._id === id)
}

function highlight (poi_id) {
  const cardActive = document.querySelector('.current-card')
  const markerActive = document.querySelector('.current-marker')
  const superMarker = document.querySelector('.master-marker')
  // querySelector don't works if poi_id begin with a number
  const marker = document.getElementById(poi_id)
  const card = document.querySelector(`#card-${poi_id}`)
  if(cardActive) {
    cardActive.classList.remove('current-card')
  }
  if(markerActive) {
    markerActive.classList.remove('current-marker')
  }
  if(card) {
    marker.classList.toggle('current-marker')
    card.classList.toggle('current-card')
  }
  superMarker.classList.remove('current-marker')
}

function masterCard (poi_id) {
  const masterCard = document.querySelector('.master-card')
  const masterMarker = document.querySelector('.master-marker')
  // querySelector don't works if poi_id begin with a number
  const selectedMarker = document.getElementById(poi_id)
  const selectedCard = document.querySelector(`#card-${poi_id}`)
  if(masterCard) {
    masterCard.classList.toggle('master-card')
  }
  if(selectedCard) {
    selectedCard.classList.toggle('master-card')
  }
  if(masterMarker) {
    masterMarker.classList.toggle('master-marker')
    masterMarker.classList.toggle('marker')
  }
  if(selectedMarker) {
    selectedMarker.classList.add('master-marker')
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
