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

// detectionLocation
if(currentLocation.length == 0) {
  focusUser()
} else {
  currentMarker(currentLocation)
}

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
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)

    if(window.location.hash) {
      const hash = getHash()
      if(hash == el.id) {
        moveTo([poi.position.longitude, poi.position.latitude])
        highligth(el.id)
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
    highligth(poi._id)
    urlFor(poi._id)
    moveTo([poi.position.longitude, poi.position.latitude])
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
    .setLngLat(currentLocation)
    .setPopup(popup)
    .addTo(map)

  moveTo(currentLocation)
}

function focusUser () {
  navigator.geolocation.getCurrentPosition(position => {
    const userPosition = [position.coords.longitude, position.coords.latitude]
    moveTo(userPosition)
    currentMarker(userPosition)
  })
}

function moveTo (position) {
  map.flyTo({
    center: position,
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

function highligth(poi_id) {
  const poiID = poi_id
  const cardActive = document.getElementsByClassName('currentCard')
  if (cardActive[0]) {
    cardActive[0].classList.toggle('currentCard')
  }
  const card = document.getElementById('card_'+poiID)
  if (card == null) {
    const cardNull = setInterval( _ => {
      highligth()
    }, 300)
    clearInterval(cardNull)
  }
  card.classList.toggle('currentCard')
}
