import React from 'react'
import ReactDOM from 'react-dom'
// Component
import Card from './Card'

class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {pois: {}};
    }

  componentDidMount() {
    fetch('/around/spots.json')
      .then(response => response.json())
      .then(response => {
        this.setState({
          pois: response
        })
      })
  }

  render() {
    const cards = Object
      .keys(this.state.pois)
      .map(key => <Card key={key} details={this.state.pois[key]} />)

    return (
      <div>{cards}</div>
    )
   }
 }

  ReactDOM.render(
    <App />,
    document.getElementById('poiCards')
  )
