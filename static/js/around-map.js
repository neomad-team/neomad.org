mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

map.addControl(new mapboxgl.NavigationControl())
map.addControl(new mapboxgl.GeolocateControl())

// users interesting points
const worker = new Worker('/static/js/webworker-around.js')

worker.onmessage = response => {
  response.data.forEach(poi => {
    const el = document.createElement('div')
    el.classList.add('marker')

    const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setHTML(`<h2>${poi.name}</h2>
                <ul>
                  <li>Wifi quality: ${poi.wifiQuality}</li>
                  <li>Power available: ${poi.powerAvailable}</li>
                  <li>Comment: ${poi.comments}</li>
                </ul>`)

    const marker = new mapboxgl.Marker(el, {offset:[4, -6]})
      .setLngLat([poi.position.longitude, poi.position.latitude])
      .setPopup(popup)
      .addTo(map)
  })
}

worker.postMessage('info-requested')

// create the current marker
const currentMarker = position => {
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText('Your current location')

  const el = document.createElement('div')
  el.classList.add('marker')
  el.classList.add('current-location')

  new mapboxgl.Marker(el, {offset:[0, -30]})
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map)

  map.setCenter(position)
  map.setZoom(11)
}

const userCenter = _ => {
  if(currentLocation.length > 0) {
    currentMarker(currentLocation.reverse())
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      currentMarker([position.coords.longitude, position.coords.latitude])
    })
  }
}

const sharePosition = id => {
  window.location.hash = id
}

// center the map according context
if (window.location.hash.indexOf('#') == 0) {
  const hash = window.location.hash.slice(1)
  fetch('/around/spots.json')
    .then(response => response.json())
    .then(items => {
      const hashData = items.find(item => item._id == hash)
      const lng = parseFloat(hashData.position.longitude)
      const lat = parseFloat(hashData.position.latitude)
      map.setCenter([lng, lat])
      map.setZoom(13)
    })
} else {
  userCenter()
}
