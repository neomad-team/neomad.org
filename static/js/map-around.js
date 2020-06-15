// POIS creation
const worker = new Worker('/static/js/webworker-around.js')
let pois = []
let currentUserLocation

function addPoi (poi) {
  const marker = L.marker(poi.location, {icon: markerIcon, alt: poi.name})
    .addTo(map)
    .on('click', _ => {
      moveTo(poi.location)
      urlFor(poi.id)
    })
  marker._icon.setAttribute('id', poi.id)

  const popup = L.popup()
  .setContent(`<h2>${poi.name}</h2>
            <ul>
              <li>Wifi quality: ${poi.wifi}</li>
              <li>Power available: ${poi.power}</li>
            </ul>`)
  marker.bindPopup(popup)

  // start view
  if(window.currentLatLng && currentLatLng.length) localizeUser.start()

  const hash = getHash()
  if(hash && hash === marker._icon.id) {
    hashMarker(hash)
    moveTo(poi.location)
  }
  else if (window.currentLatLng && currentLatLng.length) moveTo(currentLatLng)
}

worker.addEventListener('message', r => {
  pois = r.data
  r.data.forEach(addPoi)
})
worker.postMessage('')

// add users on map
usersLocation.filter(user => user.position.length).forEach(user => addUser(user))

// events
window.onhashchange = _ => {
  const hash = getHash()
  hashMarker(hash)
}

function userLocalized(userLocation) {
  currentUserLocation = userLocation
  moveTo(currentUserLocation)
}

// functions
function addUser (user) {
  const popup = L.popup()
    .setContent(`
      <a class=user-popup href=${user.link} title="View profile in detail">
        <h3>${user.name}</h3>
        <img class=avatar src="${user.avatar}" alt="Picture of ${user.name}">
        <p>${user.about}</p>
      </a>`)

  const userIcon = L.icon({
      iconUrl: user.avatar,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      className: 'avatar'
  })

  const userMarker = L.marker(user.position, {icon: userIcon})
    .setZIndexOffset(1000)
    .bindPopup(popup)
    .addTo(map)
}

function moveTo (latLng) {
  map.flyTo(latLng, 15)
}

function getHash () {
  return window.location.hash.slice(1)
}

function urlFor (id) {
  window.location.hash = id
}

function hashMarker (poi_id) {
  const superMarker = document.querySelector('.hash-marker')
  const selectedMarker = document.getElementById(poi_id)
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
