mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

// users interesting points
const giveData = new Worker("/static/js/webworker-around.js");

giveData.onmessage = (informations) => {
  const [name, lat, lng] = informations.data

  const el = document.createElement('div')
  el.classList.add('marker')

  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setHTML('<h2>{{name}}</h2><p>wifiQuality:{{wifi}}<br>powerAvailable:{{power}}<br>comments:{{comment}}<br></p>')

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat([lat, lng])
      .setPopup(popup)
      .addTo(map)
};

giveData.postMessage("info-requested");

// user last location
if(current_location.length) {
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText('you')

  const el = document.createElement('div');
  el.classList.add('marker')
  el.classList.add('you')

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat(current_location.reverse())
      .setPopup(popup)
      .addTo(map)
}
