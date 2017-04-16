onmessage = _ => {

  fetch('/around/spots.json')
    .then(response => response.json())
    .then(items => {
      items.forEach(item => {
        let name = item.name
        let wifi = item.wifiQuality
        let power = item.powerAvailable
        let comment = item.comments[0]
        let lng = item.position.longitude
        let lat = item.position.latitude
        let id = item._id
        postMessage([name, wifi, power, comment, lng, lat, id])
      })
    })
}
