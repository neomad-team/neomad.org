import React from 'react'

class Card extends React.Component {

  render() {
    return (
      <div className="card">
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

export default Card
