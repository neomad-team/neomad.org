mapboxgl.accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-10, 45],
  zoom: 2
})

// Init array to create lines between marker 
const lineCoords = []

// Previous trips
locations.forEach(point => {
  const popup = new mapboxgl.Popup({offset: [10, 0]})
      .setText(point.date)

  const el = document.createElement('div')
  el.classList.add('marker')

  lineCoords.push(point.position)

  new mapboxgl.Marker(el, {offset:[4, -6]})
      .setLngLat(point.position.reverse())
      .setPopup(popup)
      .addTo(map)
})

// Zoom to view all markers
const latitudes = locations.map(loc => loc.position[0])
const longitudes = locations.map(loc => loc.position[1])
map.fitBounds([[
    Math.min.apply(null, latitudes) - 1,
    Math.min.apply(null, longitudes) - 1
], [
    Math.max.apply(null, latitudes) + 1,
    Math.max.apply(null, longitudes) + 1
]])

// Current location
if(current_location.length) {
  const popup = new mapboxgl.Popup({offset: [10, -20]})
      .setText('Latest location')

  const el = document.createElement('div')
  el.classList.add('marker')
  el.classList.add('current')

  lineCoords.unshift(current_location)

  new mapboxgl.Marker(el, {offset:[0, -30]})
      .setLngLat(current_location.reverse())
      .setPopup(popup)
      .addTo(map)
}

// Create lines
map.on('load', _ => {
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': lineCoords
                }
            }
        },
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'rgba(212, 85, 85, 0.3)',
            'line-width': 4,
            'line-translate': [10, 0],
            'line-translate-anchor': 'map'
        }
    })
})