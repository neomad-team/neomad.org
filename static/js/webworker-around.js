onmessage = _ => {
  fetch("/static/test.json")
    .then(response => {
      return response.json();
    })
    .then(json => {
      const items = json;
      items.forEach(item => {
        let lng = item.position.longitude;
        let lat = item.position.latitude;
        postMessage([lng, lat]);
      });
    });
};
