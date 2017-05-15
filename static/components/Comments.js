import React from 'preact-compat'

class Comments extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        comments: {}
      }
    }

  componentDidMount() {
    this.setState({
      comments: this.props.value
    })
  }

  render() {
    const comments = Object
      .keys(this.state.comments)
      .map(key =>
        <li><p>{this.state.comments[key]}</p></li>
      )
    if(comments.length === 0) {
      return (
        <li className='no-comments'>
          <p>No comments available</p>
        </li>
      )
    } else {
      return (
        <li className='comments'>
          <h3>Comments:</h3>
          <ul>{comments}</ul>
        </li>
      )
    }
  }
}

export default Comments
