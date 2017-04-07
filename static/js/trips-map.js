mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

// Previous trips
locations.forEach(point => {
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText(point.date)

  const el = document.createElement('div');
  el.classList.add('marker')

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat(point.position.reverse())
      .setPopup(popup)
      .addTo(map)
})

// Current location
if(current_location.length) {
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText('Latest location')

  const el = document.createElement('div');
  el.classList.add('marker')
  el.classList.add('current')

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat(current_location.reverse())
      .setPopup(popup)
      .addTo(map)
}
