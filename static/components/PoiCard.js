import React from 'preact-compat'
// Component
import WifiRank from './WifiRank'
import Power from './Power'

class PoiCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      from: {},
      to: {}
    }
  }

  componentDidMount() {
    this.setState({
      from: [this.props.details.position.latitude, this.props.details.position.longitude],
      to: [this.props.userLat, this.props.userLng]
    })
  }

  calculateDistance(from, to) {
    const R = 6371e3 // metres
    const lat1 = this.state.from[0] * Math.PI / 180
    const lat2 = this.state.to[0] * Math.PI / 180
    const gapLat = ((lat2 * Math.PI / 180 )-(lat1 * Math.PI / 180))
    const gapLng = ((this.state.to[1] * Math.PI / 180)-(this.state.from[1] * Math.PI / 180))

    const a = Math.sin(gapLat/2) * Math.sin(gapLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(gapLng/2) * Math.sin(gapLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return Math.trunc(R * c)
  }

  render() {
    return (
      <div id={`card-${this.props.details._id}`} className='card' style={{order: this.calculateDistance(this.state.from, this.state.to)}}>
        <div className='card-distance'>{this.calculateDistance(this.state.from, this.state.to)} meters</div>
        <h2>{this.props.details.name}</h2>
        <ul>
          <WifiRank rank={this.props.details.wifiQuality} />
          <Power powerAvailability={this.props.details.powerAvailable} />
        </ul>
      </div>
    )
   }
 }

export default PoiCard
