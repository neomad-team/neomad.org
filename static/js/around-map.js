mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

// users interesting points
const pois = new Worker('/static/js/webworker-around.js')

pois.onmessage = informations => {
  const [name, wifi, power, comment, lng, lat, id] = informations.data
  const el = document.createElement('div')
  el.classList.add('marker')

  let content = `<h2>Hello ${name}</h2>
                 <ul>
                    <li>Wifi quality: ${wifi}</li>
                    <li>Power available: ${power}</li>
                    <li>Comments: ${comment}</li>
                  </ul>
                  <button value=${id} onclick=sharePosition(value)>share this position</button>`

  const popup = new mapboxgl.Popup({offset: [10, -20]})
    .setHTML(content)

  new mapboxgl.Marker(el, {offset:[0, -30]})
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map)
};

pois.postMessage('info-requested')

// create the current marker
currentMarker = position => {
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

const userCenter = _  => {
  if(currentLocation.length > 0) {
    currentMarker(currentLocation.reverse())
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      currentMarker([position.coords.longitude, position.coords.latitude])
    })
  }
}

sharePosition = id => {
  window.location.hash = id
}

// center the map according context
if (window.location.hash.indexOf("#") == 0) {
  let hash = window.location.hash.split('#')[1]
  fetch('/around/spots.json')
    .then(response => response.json())
    .then(items => {
      let hashData = items.find(item => item._id == hash)
      let hashLng = hashData.position.longitude
      let hashLat = hashData.position.latitude

      let lng = parseFloat(hashLng)
      let lat = parseFloat(hashLat)

      let hashCoords = [lng,lat]
      map.setCenter(hashCoords)
      map.setZoom(16)
    })
} else {
  userCenter()
}
