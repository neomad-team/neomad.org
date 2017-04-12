mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

// users interesting points
const pois = new Worker('/static/js/webworker-around.js');

pois.onmessage = informations => {
  const [name, wifi, power, comment, lng, lat] = informations.data

  const el = document.createElement('div')
  el.classList.add('marker')

  let content = `<h2>Hello ${name}</h2>
                 <ul>
                    <li>Wifi quality: ${wifi}</li>
                    <li>Power available: ${power}</li>
                    <li>Comments: ${comment}</li>
                  </ul>`

  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setHTML(content)

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map)
};

pois.postMessage('info-requested');

// user last location
if(currentLocation.length) {
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText('Your current location')

  const el = document.createElement('div');
  el.classList.add('marker')
  el.classList.add('current-location')

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat(currentLocation.reverse())
      .setPopup(popup)
      .addTo(map)

  map.setCenter(currentLocation)
  map.setZoom(11)
}
