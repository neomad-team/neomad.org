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
      unit: ['meters', 'km']
    }
    // cf: https://facebook.github.io/react/docs/handling-events.html
    this.hoverCard = this.hoverCard.bind(this)
    this.clickCard = this.clickCard.bind(this)
  }

  componentDidMount() {
    this.setState({
      from: [this.props.details.position.latitude, this.props.details.position.longitude],
      to: [this.props.userLat, this.props.userLng]
    })
    if(this.props.details._id === getHash()) {
      highlight(this.props.details._id)
      superCard(this.props.details._id)
      firstCard(this.props.details._id)
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

  renderDistance(distance, unit) {
    if(!distance){ 
      return ''
    } else if(distance > 1000) {
      distance = Math.round(distance/1000)
      return `${distance} ${unit[1]}`
    } else {
      return `${distance} ${unit[0]}`
    }
  }

  hoverCard() {
    highlight(this.props.details._id)
  }

  clickCard() {
    if(this.props.details._id === getHash()) {
      if( map.getZoom() < 14) {
        moveTo([this.props.details.position.latitude, this.props.details.position.longitude], 14)
      } else {
        moveTo([this.props.details.position.latitude, this.props.details.position.longitude], 11)
      }
    } else {
      moveTo([this.props.details.position.latitude, this.props.details.position.longitude], 11)
    }
    urlFor(this.props.details._id)
  }

  render() {
    return (
      <div
        className='card'
        id={`card-${this.props.details._id}`}
        onMouseEnter={this.hoverCard}
        onMouseLeave={this.hoverCard}
        onClick={this.clickCard}
        style={{order: this.calculateDistance(this.state.from, this.state.to)}}>
        <div className='card-distance'>{this.renderDistance(this.calculateDistance(this.state.from, this.state.to), this.state.unit)}</div>
        <h2>{this.props.details.name}</h2>
        <ul>
          <Rank value={this.props.details.wifiQuality} />
          <Power value={this.props.details.powerAvailable} />
          <Comments value={this.props.details.comments} />
        </ul>
      </div>
    )
   }
 }

export default PoiCard
