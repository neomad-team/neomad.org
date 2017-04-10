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
  const [name,wifi,power,comment,lng,lat] = informations.data

  const el = document.createElement('div')
  el.classList.add('marker')

  let content = "<h2>"+name+"</h2><p>Wifi quality: "+ wifi+"<br>Power available: "+power+"<br>Comments: "+comment+"</p>"
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setHTML(content)

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat([lng, lat])
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

  map.setCenter(current_location)
  map.setZoom(11)
}
