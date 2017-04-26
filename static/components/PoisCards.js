class App extends React.Component {

  componentDidMount() {
    fetch('/around/spots.json')
      .then(response => response.json())
      .then(response => {
        this.setState({
          data: response
        })
      })
  }

   render() {
     return <div>{this.props.name}</div>
   }
 }

  ReactDOM.render(
    <App name="test" />,
    document.getElementById('poisCards')
  )
