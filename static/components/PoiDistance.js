import React from 'react'

class PoiDistance extends React.Component {

  render() {

    const distance = distance => {
      var lat1 = parseFloat(this.props.lat1)
      var lat2 = parseFloat(this.props.lat2)
      var lng1 = parseFloat(this.props.lng1)
      var lng2 = parseFloat(this.props.lng2)

      var R = 6371e3; // metres
      var num_lat1 = lat1 * Math.PI / 180;
      var num_lat2 = lat2 * Math.PI / 180;
      var gapLat = ((num_lat2 * Math.PI / 180 )-(num_lat1 * Math.PI / 180))
      var gapLng = ((lng2 * Math.PI / 180)-(lng1 * Math.PI / 180));

      var a = Math.sin(gapLat/2) * Math.sin(gapLat/2) +
              Math.cos(num_lat1) * Math.cos(num_lat2) *
              Math.sin(gapLng/2) * Math.sin(gapLng/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var distance = Math.trunc(R * c)
      return distance
    }
    return <div className='cardDistance'>{distance(distance)}m from you</div>
  }
}

export default PoiDistance
