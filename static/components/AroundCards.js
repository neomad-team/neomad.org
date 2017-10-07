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
    worker.addEventListener('message', r => {
      pois = r.data
      this.setState({
        pois: pois
      })
    })

    map.on('moveend', move => {
      this.setState({mapBounds: map.getBounds()})
    })
    this.setState({mapBounds: map.getBounds()})

    if(currentLatLng) {
      this.setState({userPosition: currentLatLng})
      currentMarker (currentLatLng)
    }
  }

  render() {
    const cards = Object
      .keys(this.state.pois)
      .filter(key => {
        const location = this.state.pois[key].location
        return (location[0] <= this.state.mapBounds._northEast.lat
          && location[0] >= this.state.mapBounds._southWest.lat
          && location[1] <= this.state.mapBounds._northEast.lng
          && location[1] >= this.state.mapBounds._southWest.lng)
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
