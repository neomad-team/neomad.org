mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

let userMarker

if(currentLocation) {
  createUserMarker(currentLocation)
}

const worker = new Worker('/static/js/webworker-around.js')

worker.addEventListener('message', response => {
  pois = response.data
  pois.forEach(poi => {
    const el = document.createElement('div')
    el.classList.add('marker')
    el.id = poi._id

    const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setHTML(`<h2>Hello ${poi.name}</h2>
                <ul>
                  <li>Wifi quality: ${poi.wifiQuality}</li>
                  <li>Power available: ${poi.powerAvailable}</li>
                </ul>`)

    new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)
  })
  if(getHash()) {
    const poi = findPoi(getHash())
    map.setCenter([poi.position.longitude, poi.position.latitude])
    map.setZoom(9)
  } else {
    focusUser()
  }
})
worker.postMessage('')

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

function moveToUser () {
  if(!userMarker) {
    createUserMarker(currentLocation)
  }
  map.flyTo({center: currentLocation.reverse()})
}

//
// function currentMarker (position) {
//   if(!userMarker) {
//     const popup = new mapboxgl.Popup({offset: [10, -20]})
//         .setText('Your current location')
//
//     const el = document.createElement('div')
//     el.classList.add('marker')
//     el.classList.add('current-location')
//
//     const marker = new mapboxgl.Marker(el, {offset:[0, -30]})
//       .setLngLat(position)
//       .setPopup(popup)
//       .addTo(map)
//     userMarker = marker
//   }
  //
  // map.setCenter(position)
  // map.setZoom(11)
// }

function createUserMarker(latLng) {
  if(userMarker) return
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText('Your current location')

  const el = document.createElement('div')
  el.classList.add('marker')
  el.classList.add('current-location')

  const marker = new mapboxgl.Marker(el, {offset:[0, -30]})
    .setLngLat(latLng.reverse())
    .setPopup(popup)
    .addTo(map)
  userMarker = marker
}

function focusUser () {
  navigator.geolocation.getCurrentPosition(position => {
    currentLocation = [position.coords.latitude, position.coords.longitude]
    moveToUser()
  }, error => {
    moveToUser()
  })
}

function detectLocation () {
  navigator.geolocation.getCurrentPosition(position => {
    moveToUser([position.coords.latitude, position.coords.longitude])
  })
}
