// init Map
const accessToken = 'pk.eyJ1IjoibmVvbWFkIiwiYSI6ImNqMHRrZ3ZwdzAwNDgzMm1kcHRhMDdsZGIifQ.bOSlLkmc1LBv0xAbcZXpog'
const map = L.map('map', {
  center: [0, 0],
  zoom: 2,
  minZoom: 2,
  zoomControl: false,
  attributionControl: false,
  layers: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?${''}access_token=${accessToken}`)
})

new L.Control.Zoom({position: 'topright'}).addTo(map)

// credentials
const credits = L.control.attribution()
const mapbox = '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
const osm = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const contribute = '- <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
credits.addAttribution(`${mapbox} ${osm} ${contribute}`).addTo(map)

// user position
const localizeUser = new L.control.locate({
  position: 'topright',
  setView: 'untilPan',
  locateOptions: {maxZoom: 14}
  }).addTo(map)

// create icon model
class MarkerIcon extends L.Icon {
  constructor(options) {
    super(options)
    L.Util.setOptions(this, {
      iconAnchor: [15, 42],
      popupAnchor: [0, -25],
      className: 'marker'
    })
  }
  createIcon() {
    const marker = document.createElement('div')
    marker.innerHTML = `<svg xmlns:cc="http://creativecommons.org/ns" xmlns:svg="http://www.w3.org/2000/svg" version="1.1"
      viewBox="300 100 1200 1200"
      width="30px"
      height="50px">
      <g transform="matrix(1,0,0,-1,364.47458,1270.2373)">
        <circle cx="500" cy="900" r="300" style="fill:white"/>
        <path d="m 768,896 q 0,106 -75,181 -75,75 -181,75 -106,0 -181,-75 -75,-75 -75,-181 0,-106 75,-181 75,-75 181,-75 106,0 181,75 75,75 75,181 z m 256,0 q 0,-109 -33, -179 L 627,-57 q -16,-33 -47.5,-52 -31.5,-19 -67.5,-19 -36,0 -67.5,19 Q 413,-90 398, -57 L 33,717 Q 0,787 0,896 q 0,212 150,362 150,150 362,150 212,0 362,-150 150,-150 150,-362 z"/>
      </g>
    </svg>`
    this._setIconStyles(marker, 'icon')
    return marker
  }
}
// marker model cache
const markerIcon = new MarkerIcon
