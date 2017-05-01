import React from 'react'
import ReactDOM from 'react-dom'
// Component
import Card from './Card'

class App extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        pois: {},
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
          Math.round(this.state.pois[key].position.latitude) == Math.round(this.state.userLocation[0])
          &&
          Math.round(this.state.pois[key].position.longitude) == Math.round(this.state.userLocation[1]))
      })
      .map(key =>
        <Card
          key={key}
          details={this.state.pois[key]}
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