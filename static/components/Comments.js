import React from 'preact-compat'

class Comments extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        comments: {}
      }
    }

  componentDidMount() {
    this.setState({comments: this.props.value})
  }

  render() {
    const comments = Object
    .keys(this.state.comments)
    .map(key =>
      <p>{this.state.comments[key]}</p>
    )
    if(comments.length) {
      return (
        <details>
          <summary>Comments</summary>
          <p>{comments}</p>
        </details>
      )
    }
  }
}

export default Comments
