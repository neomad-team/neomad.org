mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

map.addControl(new mapboxgl.NavigationControl())
map.addControl(new mapboxgl.GeolocateControl())

// users interesting points
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
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)
  })
})

worker.postMessage('')

// create the current marker
function currentMarker (position) {
  const popup = new mapboxgl.Popup({offset: [10, 0]})
    .setText('Your current location')

  const el = document.createElement('div')
  el.classList.add('marker')
  el.classList.add('current')

  new mapboxgl.Marker(el, {offset:[0, -30]})
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map)

  map.setCenter(position)
  map.setZoom(11)
}

// a étudier

map.on('click', event => {
  const poi = findPoi(event.originalEvent.target.id)
  if(poi) {
    urlFor(poi._id)
    map.flyTo({center: [poi.position.longitude, poi.position.latitude]})

  }
})

function findPoi (id) {
  return pois.find(poi => poi._id == id)
}

function getHash () {
  return window.location.hash.slice(1)
}

function urlFor (id) {
  window.location.hash = id
}

function focusUser () {
  navigator.geolocation.getCurrentPosition(position => {
  map.setZoom(11)
  map.flyTo({center: [position.coords.longitude, position.coords.latitude]})
  currentMarker([position.coords.longitude, position.coords.latitude])
  })
}

// center the map according context
window.onload = _ => {
  if (window.location.hash.indexOf('#') == 0) {
    const hash = getHash()
    fetch('/around/spots.json')
      .then(response => response.json())
      .then(items => {
        const hashData = items.find(item => item._id == hash)
        const lng = parseFloat(hashData.position.longitude)
        const lat = parseFloat(hashData.position.latitude)
        map.flyTo([lat, lng])
        map.setZoom(11)
      })
  } else if (currentLocation.length == 0) {
    focusUser()
  } else if (position) {
    currentMarker()
  }
}
