import React from 'preact-compat'
// Component
import Rank from './Rank'
import Power from './Power'
import Comments from './Comments'

class PoiCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      from: {},
      to: {},
    }
    // cf: https://facebook.github.io/react/docs/handlg-events.html
    this.enterCard = this.enterCard.bind(this)
    this.leaveCard = this.leaveCard.bind(this)
    this.clickCard = this.clickCard.bind(this)
  }

  componentDidMount() {
    this.setState({
      from: this.props.details.location,
      to: [this.props.userLat, this.props.userLng]
    })
    if(this.props.details.id === getHash()) {
      highlight(this.props.details.id)
      hashCard(this.props.details.id)
      firstCard(this.props.details.id)
    }
  }

  calculateDistance(from, to) {
    if(to[0] && to[1]) {
      const R = 6371e3 // metres
      const lat1 = this.state.from[0] * Math.PI / 180
      const lat2 = this.state.to[0] * Math.PI / 180
      const gapLat = ((lat2 * Math.PI / 180 )-(lat1 * Math.PI / 180))
      const gapLng = ((this.state.to[1] * Math.PI / 180)-(this.state.from[1] * Math.PI / 180))
      const a = Math.sin(gapLat/2) * Math.sin(gapLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(gapLng/2) * Math.sin(gapLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = Math.trunc(R * c)

      return distance
    }
  }

  renderDistance(distance) {
    if(!distance) return ''
    if(distance > 1000) {
      return `${Math.round(distance/1000)} km`
    } else {
      return `${distance} m`
    }
  }

  enterCard() {
    highlight(this.props.details.id)
  }

  leaveCard() {
    delight(this.props.details.id)
  }

  clickCard() {
    moveTo(this.props.details.location)
    urlFor(this.props.details.id)
  }

  render() {
    return (
      <div
        className='card'
        id={`card-${this.props.details.id}`}
        onMouseEnter={this.enterCard}
        onMouseLeave={this.leaveCard}
        onClick={this.clickCard}
        style={{order: this.calculateDistance(this.state.from, this.state.to)}}>
        <div className='card-distance'>{this.renderDistance(this.calculateDistance(this.state.from, this.state.to), this.state.unit)}</div>
        <h2 title={this.props.details.name}>{this.props.details.name}</h2>
        <ul>
          <li><Rank value={this.props.details.wifi} /></li>
          <li><Power value={this.props.details.power} /></li>
          <li><Comments value={this.props.details.comments} /></li>
        </ul>
      </div>
    )
   }
 }

export default PoiCard
