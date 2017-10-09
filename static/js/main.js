function autoReplaceCoordinates () {
  Array.from(document.querySelectorAll('[data-latlng]')).forEach(a => {
    coordinatesToAddress(a.dataset.latlng).then(data => {
       a.textContent = `${data.town || data.village || data.city}, ${data.country}`
    })
  })
}

autoReplaceCoordinates()
