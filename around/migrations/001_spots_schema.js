db.spot.find().forEach(function(spot) {
  spot['wifi'] = Number(spot['wifi_quality']);
  delete spot['wifi_quality'];
  spot['power'] = Number(spot['power_available']);
  delete spot['power_available'];
  spot['comments'] = [spot['comments'][0] ? spot['comments'][0] : null]
  db.spot.update({_id: spot._id}, spot);
})
