// Init array to create lines between marker 
const lineCoords = []

// Zoom to view all positions
const latitudes = locations.map(loc => loc.position[0])
const longitudes = locations.map(loc => loc.position[1])
map.fitBounds([[
    Math.min.apply(null, latitudes) - 2,
    Math.min.apply(null, longitudes) - 2
], [
    Math.max.apply(null, latitudes) + 2,
    Math.max.apply(null, longitudes) + 2
]])

// Last trips
const lastPosition = locations.pop()
currentMarker = L.marker(lastPosition.position, {icon: icon, alt: lastPosition.date}).addTo(map)

const popup = L.popup().setContent(`<p>Last position knew - ${lastPosition.date}</p>`)
currentMarker.bindPopup(popup).openPopup()

lineCoords.push(lastPosition.position)

// Previous trips
icon.options.className = 'previous-marker'
locations.reverse().forEach(point => {
  
  const marker = L.marker(point.position, {icon: icon, alt: point.date}).addTo(map)

  const popup = L.popup().setContent(`<p>${point.date}</p>`)
  marker.bindPopup(popup)

  lineCoords.push(point.position)
})

const lineOptions = {
  stroke: true,
  color: '#297DDB',
  weight: 3,
  opacity: 0.5,
  smoothFactor: 1
}

const line = L.polyline(lineCoords, lineOptions).addTo(map);
