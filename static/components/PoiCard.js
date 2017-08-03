import React from 'preact-compat'
// Component
import Comments from './Comments'

class PoiCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      from: {},
      to: {},
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

  renderDistance(distance) {
    if(!distance) return ''
    if(distance > 1000) {
      return `${Math.round(distance/1000)} km`
    } else {
      return `${distance} meters`
    }
  }

  hoverCard() {
    highlight(this.props.details._id)
  }

  clickCard() {
    let zoomLevel = 11
    if(this.props.details._id === getHash() && map.getZoom() < 14) {
      zoomLevel = 14
    }
    moveTo([this.props.details.position.latitude, this.props.details.position.longitude], zoomLevel)
    urlFor(this.props.details._id)
  }

  render() {
    const rank = (
      <li className={`rank-${this.props.details.wifiQuality}`}>
        <h3>Wifi:</h3>
        <svg viewBox='0 0 1000 1000'><path d='M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z'></path></svg>
        <svg viewBox='0 0 1000 1000'><path d='M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z'></path></svg>
        <svg viewBox='0 0 1000 1000'><path d='M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z'></path></svg>
        <svg viewBox='0 0 1000 1000'><path d='M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z'></path></svg>
        <svg viewBox='0 0 1000 1000'><path d='M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z'></path></svg>
      </li>)

    const power = (
      <li className={`power-${this.props.details.powerAvailable}`}>
        <h3>Power:</h3>
        <svg viewBox='0 0 16 24'><path d='M15.649 9.165a.815.815 0 0 0-.778-.392l-3.724.379c-1.005.102-1.127-.018-1.057-.861l.596-7.025c.032-.368.08-1.107-.41-1.248-.42-.122-.86.42-1.07.723L.14 14.088a.81.81 0 0 0-.025.872.84.84 0 0 0 .779.391l3.859-.392c1.003-.102.994-.002.924.84l-.598 7.059c-.031.367.019.951.42 1.09.478.163.905-.34 1.059-.564 2.27-3.335 9.066-13.347 9.066-13.347a.811.811 0 0 0 .025-.873'></path></svg>
      </li>)

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
          {rank}
          {power}
          <Comments value={this.props.details.comments} />
        </ul>
      </div>
    )
   }
 }

export default PoiCard
