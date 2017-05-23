import React from 'preact-compat'
import ReactDOM from 'preact-compat'
// Component
import PoiCard from './PoiCard'

class App extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        pois: {},
        userPosition: {},
        mapBounds: {}
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
      const bounds = map.getBounds()
      this.setState({
        mapBounds: bounds
      })
    })
    const bounds = map.getBounds()
    this.setState({
      mapBounds: bounds
    })
    if(currentLatLng.length === 0) {
      navigator.geolocation.getCurrentPosition(position => {
        const userPosition = [position.coords.latitude, position.coords.longitude]
        this.setState({
          userPosition: userPosition
        })
        if(getHash()) {
          currentMarker(userPosition)
        } else {
          focusUser(userPosition)
        }
      }, function errorCallback (error) {
        alert(`error navigator code is ${error.code} meaning`, error.message)
      }, {
        maximumAge: Infinity,
        timeout: 5000
      })
    } else {
      currentMarker(currentLatLng)
      this.setState({
        userPosition: currentLatLng
      })
    }
  }

  render() {
    const cards = Object
      .keys(this.state.pois)
      .filter(key => {
        return (this.state.pois[key].position.latitude <= this.state.mapBounds._ne.lat
          && this.state.pois[key].position.latitude >= this.state.mapBounds._sw.lat
          && this.state.pois[key].position.longitude <= this.state.mapBounds._ne.lng
          && this.state.pois[key].position.longitude >= this.state.mapBounds._sw.lng)
      })
      .map(key =>
        <PoiCard
          key={key}
          details={this.state.pois[key]}
          userLat={this.state.userPosition[0]}
          userLng={this.state.userPosition[1]}
        />
      )

    return (
      <div>{cards}</div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('poi-cards')
)
