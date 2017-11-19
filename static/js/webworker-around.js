onmessage = _ => {
  fetch('/api/spots/')
    .then(r => r.json())
    .then(postMessage)
    .catch(e => console.error(e))
}
