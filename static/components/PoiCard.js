import React from 'react'

class PoiCard extends React.Component {

  render() {
    const distance = distance => {
      const lat1 = parseFloat(this.props.details.position.latitude)
      const lat2 = parseFloat(this.props.userLat)
      const lng1 = parseFloat(this.props.details.position.longitude)
      const lng2 = parseFloat(this.props.userLng)

      const R = 6371e3 // metres
      const num_lat1 = lat1 * Math.PI / 180
      const num_lat2 = lat2 * Math.PI / 180
      const gapLat = ((num_lat2 * Math.PI / 180 )-(num_lat1 * Math.PI / 180))
      const gapLng = ((lng2 * Math.PI / 180)-(lng1 * Math.PI / 180))

      const a = Math.sin(gapLat/2) * Math.sin(gapLat/2) +
              Math.cos(num_lat1) * Math.cos(num_lat2) *
              Math.sin(gapLng/2) * Math.sin(gapLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

      return Math.trunc(R * c)
    }
    const order = {
      order: distance(distance)
    }

    return (
      <div id={'card-'+this.props.details._id} className='card' style={order}>
        <div className='card-distance'>{distance(distance)} meters</div>
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
