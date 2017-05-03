import React from 'react'

import PoiDistance from './PoiDistance'

class PoiCard extends React.Component {

  render() {
    return (
      <div className='card'>
        <PoiDistance
          lat1={this.props.details.position.latitude}
          lng1={this.props.details.position.longitude}
          lat2={this.props.userLat}
          lng2={this.props.userLng} />
        <h2>{this.props.details.name}</h2>
        <ul>
          <li>Wifi quality: {this.props.details.wifiQuality}/5</li>
          <li>Power available: {this.props.details.powerAvailable}</li>
          <li>Comments: {this.props.details.comments}</li>
        </ul>
      </div>
    )
   }
 }

export default PoiCard
