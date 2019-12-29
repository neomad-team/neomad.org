function autoReplaceCoordinates () {
  Array.from(document.querySelectorAll('[data-latlng]')).forEach(a => {
    coordinatesToAddress(a.dataset.latlng).then(data => {
       a.textContent = `${data.town || data.village || data.city}, ${data.country}`
    })
  })
}

function coordinatesToAddress (coordinates) {
  const [lat, lng] = coordinates.split(',')
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
    mode: 'cors'
  })
  .then(r => r.json())
  .then(d => {
    const data = d.address
    data['area'] = data.town || data.village || data.city
    return data
  })
}

autoReplaceCoordinates()
