import React from 'react'

import PoiDistance from './PoiDistance'

class PoiCard extends React.Component {

  render() {
    return (
      <div id={'card_'+this.props.details._id} className='card'>
        <PoiDistance
          lat1={this.props.details.position.latitude}
          lng1={this.props.details.position.longitude}
          lat2={this.props.userLat}
          lng2={this.props.userLng} />
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
