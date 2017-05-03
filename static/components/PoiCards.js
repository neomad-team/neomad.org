import React from 'react'
import ReactDOM from 'react-dom'
// Component
import PoiCard from './PoiCard'

class App extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        pois: {},
        userView: {},
        userLocation: {}
      }
    }

  componentDidMount() {
    fetch('/around/spots.json')
      .then(response => response.json())
      .then(response => {
        this.setState({
          pois: response
        })
      })
    map.on('moveend', move => {
      const centerMap = map.getCenter()
      this.setState({
        userView: centerMap
      })
    })
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: [position.coords.latitude, position.coords.longitude]
       })
    })
  }

  render() {
    const cards = Object
      .keys(this.state.pois)
      .filter(key => {
        return (
          Math.round(this.state.pois[key].position.latitude) == Math.round(this.state.userView.lat)
          &&
          Math.round(this.state.pois[key].position.longitude) == Math.round(this.state.userView.lng))
      })
      .map(key =>
        <PoiCard
          key={key}
          details={this.state.pois[key]}
          userLat={this.state.userLocation[0]}
          userLng={this.state.userLocation[1]}
        />
      )

    return (
      <div>{cards}</div>
    )
   }
 }

ReactDOM.render(
  <App />,
  document.getElementById('poiCards')
)
