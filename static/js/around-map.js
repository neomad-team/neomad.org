let i = 0
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

    const popup = new mapboxgl.Popup({offset: [10, 0]})
      .setHTML(`<h2>${poi.name}</h2>
                <h3>Comments:</h3>
                <p>${poi.comments}</p>`)

    const marker = new mapboxgl.Marker(el, {offset:[4, -6]})
      // OSM standard [Lng, Lat]
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)

    if(window.location.hash) {
      const hash = getHash()
      if(hash == el.id) {
        moveTo([poi.position.latitude, poi.position.longitude], 11)
        borderCard(hash)
        firstCard(hash)
      }
    }
  })
})

worker.postMessage('')

// event
map.on('click', event => {
  const poi = findPoi(event.originalEvent.target.id)
  if(poi) {
    highlight(poi._id)
    urlFor(poi._id)
    moveTo([poi.position.latitude, poi.position.longitude], 11)
  }
})

window.onhashchange = _ => {
  const hash = getHash()
  borderCard(hash)
}

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
  return pois.find(poi => poi._id == id)
}

function highlight (poi_id) {
  const cardActive = document.querySelector('.current-card')
  const markerActive = document.querySelector('.current-marker')
  const card = document.querySelector('#card-'+poi_id)
  const marker = document.querySelector('#'+poi_id)
  if(cardActive) {
    cardActive.classList.toggle('current-card')
  }
  if(markerActive) {
    markerActive.classList.toggle('current-marker')
  }
  if(card) {
    card.classList.toggle('current-card')
    marker.classList.toggle('current-marker')
  }
}

function borderCard (poi_id) {
  const masterCard = document.querySelector('.master-card')
  if(masterCard) {
    masterCard.classList.toggle('master-card')
  }
  const hashCard = document.querySelector('#card-'+poi_id)
  hashCard.classList.toggle('master-card')
}

function firstCard (poi_id) {
  const hashCard = document.querySelector('#card-'+poi_id)
  hashCard.classList.toggle('first-card')
}
