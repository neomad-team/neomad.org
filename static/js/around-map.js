// Init Map

mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})
map.addControl(new mapboxgl.NavigationControl())
map.addControl(new mapboxgl.GeolocateControl())

// Pois marker
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

// Event on load - Position according URL
window.onload = _ => {
  // si il y a un hash
  if (window.location.hash.indexOf('#') == 0) {
    // currentMarker()
    const hash = getHash()
    fetch('/around/spots.json')
      .then(response => response.json())
      .then(items => {
        const hashData = items.find(item => item._id == hash)
        const position = [parseFloat(hashData.position.longitude), parseFloat(hashData.position.latitude)]
        map.flyTo({
          center: position,
          zoom: 11,
          bearing: 0,
          speed: 1.7,
          curve: 1
        })
      })
  // si l'user n'a pas donné sa position
  } else if (currentLocation.length == 0) {
    focusUser()
  // si l'user accepte la localisation
  } else if (currentLocation.length > 0) {
    currentMarker(currentLocation)
  }
}

// Event On Map
map.on('click', event => {
  const poi = findPoi(event.originalEvent.target.id)
  if(poi) {
    urlFor(poi._id)
    map.flyTo({
      center: [poi.position.longitude, poi.position.latitude],
      zoom: 11,
      bearing: 0,
      speed: 1.7,
      curve: 1
    })
  }
})

// functions
function currentMarker (currentLocation) {
  const popup = new mapboxgl.Popup({offset: [10, 0]})
    .setText('Your current location')

  const el = document.createElement('div')
  el.classList.add('marker')
  el.classList.add('current')

  new mapboxgl.Marker(el, {offset:[0, -30]})
    .setLngLat(currentLocation.reverse())
    .setPopup(popup)
    .addTo(map)

  map.flyTo({
    center: currentLocation,
    zoom: 11,
    bearing: 0,
    speed: 1.7,
    curve: 1
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

function focusUser () {
  navigator.geolocation.getCurrentPosition(position => {
    map.flyTo({
      center: [position.coords.longitude, position.coords.latitude],
      zoom: 11,
      bearing: 0,
      speed: 1.7,
      curve: 1
    })
  currentMarker([position.coords.longitude, position.coords.latitude])
  })
}
