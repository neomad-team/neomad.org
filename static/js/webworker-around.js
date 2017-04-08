onmessage = _ => {
  fetch("/static/test.json")
    .then(response => {
      return response.json();
    })
    .then(json => {
      const items = json;
      items.forEach(item => {
        let name = item.name;
        let wifi = item.wifiQuality;
        let power = item.powerAvailable;
        let comment = item.comments[0];
        let lng = item.position.longitude;
        let lat = item.position.latitude;
        postMessage([name,wifi,power,comment,lng,lat]);
      });
    });
};
