import React from 'preact-compat'
import ReactDOM from 'preact-compat'
// Component
import PoiCard from './PoiCard'

class App extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        pois: {},
        userView: {},
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
      const centerMap = map.getCenter()
      const bounds = map.getBounds()
      this.setState({
        userView: centerMap,
        mapBounds: bounds
      })
    })
    if (currentLocation.length == 0) {
      const localPosition = localStorage.userPosition.split(',', 2)
      this.setState({
        userPosition: [parseFloat(localPosition[0]), parseFloat(localPosition[1])]
      })
    } else {
        this.setState({
          userPosition: [currentLocation[1], currentLocation[0]]
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
