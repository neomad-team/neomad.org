// Current position
const currentLocation = locations.slice(-1)[0]
const currentMarker = L.marker(currentLocation.position, {icon: markerIcon, alt: currentLocation.date})
  .bindPopup(L.popup().setContent(`<p>Latest known position - ${currentLocation.date}</p>`))

// Previous trips
const markers = L.featureGroup(locations.reverse().slice(1).map(marker => {
  const popup = L.popup().setContent(`<p>${marker.date}</p>`)
  return L.circleMarker(marker.position, {
      color: '#297ddb',
      opacity: .75,
      weight: 3,
      fillColor: 'white',
      fillOpacity: 1,
      radius: 5,
    }).bindPopup(popup)
}))

L.polyline(locations.map(l => l.position), {
    stroke: true,
    color: '#297ddb',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1,
    popupAnchor: [-7, -10],
  }).addTo(map)

markers.addTo(map)
currentMarker.addTo(map)
markers.addLayer(currentMarker)

// Zoom to view all positions
map.fitBounds(markers.getBounds())
