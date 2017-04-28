onmessage = _ => {
  fetch('/around/spots.json')
    .then(response => response.json())
    .then(postMessage)
}
