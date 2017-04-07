mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

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
