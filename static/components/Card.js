import React from 'react'

class Card extends React.Component {

  closeCard = _ => {

  }

  render() {
    return (
      <div className="card">
        <h2>{this.props.details.name}</h2>
        <ul>
          <li>power avaibality: {this.props.details.powerAvailable}</li>
          <li>Wifi quality: {this.props.details.wifiQuality}/5</li>
        </ul>
      </div>
    )
   }
 }

export default Card
