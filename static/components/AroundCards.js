import React from 'preact-compat'
import ReactDOM from 'preact-compat'
// Component
import PoiCard from './PoiCard'

class App extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        pois: {},
        userPosition: [],
        mapBounds: {}
      }
    }

  componentDidMount() {
    fetch('/api/spots/')
      .then(response => response.json())
      .then(response => {
        this.setState({
          pois: response
        })
      })

    map.on('moveend', move => {
      this.setState({mapBounds: map.getBounds()})
    })
    this.setState({mapBounds: map.getBounds()})

    if(currentLatLng.length === 0) {
      navigator.geolocation.getCurrentPosition(position => {
        const userPosition = [position.coords.latitude, position.coords.longitude]
        this.setState({userPosition: userPosition})
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
      this.setState({userPosition: currentLatLng})
    }
  }

  render() {
    const cards = Object
      .keys(this.state.pois)
      .filter(key => {
        const location = this.state.pois[key].location
        return (location[0] <= this.state.mapBounds._ne.lat
          && location[0] >= this.state.mapBounds._sw.lat
          && location[1] <= this.state.mapBounds._ne.lng
          && location[1] >= this.state.mapBounds._sw.lng)
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
