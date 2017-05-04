import React from 'react'

class PoiCard extends React.Component {

  render() {
    const distance = distance => {
      var lat1 = parseFloat(this.props.details.position.latitude)
      var lat2 = parseFloat(this.props.userLat)
      var lng1 = parseFloat(this.props.details.position.longitude)
      var lng2 = parseFloat(this.props.userLng)

      var R = 6371e3; // metres
      var num_lat1 = lat1 * Math.PI / 180;
      var num_lat2 = lat2 * Math.PI / 180;
      var gapLat = ((num_lat2 * Math.PI / 180 )-(num_lat1 * Math.PI / 180))
      var gapLng = ((lng2 * Math.PI / 180)-(lng1 * Math.PI / 180));

      var a = Math.sin(gapLat/2) * Math.sin(gapLat/2) +
              Math.cos(num_lat1) * Math.cos(num_lat2) *
              Math.sin(gapLng/2) * Math.sin(gapLng/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var distance = Math.trunc(R * c)
      return distance
    }
    const order = {
      order: distance(distance)
    }

    return (
      <div id={'card-'+this.props.details._id} className='card' style={order}>
        <div className='card_distance'>{distance(distance)} meters</div>
        <h2>{this.props.details.name}</h2>
        <ul>
          <li>Wifi quality: {this.props.details.wifiQuality}/5</li>
          <li>Power available: {this.props.details.powerAvailable}</li>
        </ul>
      </div>
    )
   }
 }

export default PoiCard
