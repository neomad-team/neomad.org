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
                <ul>
                  <li>Wifi quality: ${poi.wifiQuality}</li>
                  <li>Power available: ${poi.powerAvailable}</li>
                  <li>Comments: ${poi.comments}</li>
                </ul>`)

    const marker = new mapboxgl.Marker(el, {offset:[4, -6]})
      // OSM standard [Lng, Lat]
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)

    if(window.location.hash) {
      const hash = getHash()
      if(hash == el.id) {
        moveTo([poi.position.latitude, poi.position.longitude], 11)
      }
    }
  })
})

worker.postMessage('')

// event
map.on('click', event => {
  map.setZoom(2)
  const poi = findPoi(event.originalEvent.target.id)
  if(poi) {
    highlight(poi._id)
    urlFor(poi._id)
    moveTo([poi.position.latitude, poi.position.longitude], 11)
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

function focusTo (latLng) {
  // OSM standard [Lng, Lat]
  map.flyTo({
    center: [latLng[1], latLng[0]],
    zoom: 15
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
  const cardActive = document.getElementsByClassName('current-card')[0]
  const markerActive = document.getElementsByClassName('selected')[0]
  const card = document.getElementById('card-'+poi_id)
  const marker = document.getElementById(poi_id)
  if (cardActive) {
    cardActive.classList.toggle('current-card')
  }
  if (markerActive) {
    markerActive.classList.toggle('selected')
  }
  if (card) {
    card.classList.toggle('current-card')
  }
  if (marker) {
    marker.classList.toggle('selected')
  }
}
