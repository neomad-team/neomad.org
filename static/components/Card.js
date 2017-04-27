import React from 'react'

class Card extends React.Component {

  render() {
    return (
      <div className="card">
        <h2>{this.props.details.name}</h2>
        <ul>
          <li></li>
        </ul>
      </div>
    )
   }
 }

export default Card
