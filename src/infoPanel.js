import React from "react";


let panelStyle = {
  color: 'white',
  backgroundColor: 'grey',
  display: 'flex',
  flexDirection:'row',
  marginTop: '25px',
  zIndex: '500',
  textAlign: 'center',
  justifyContent: 'space-evenly',
  fontSize: '20px',
}


class InfoPanel extends React.Component {
  render() {
    if (this.props.giveUp) {
      return (
        <div id="infoPanel" style = {panelStyle}>
          <p>Score: {this.props.score}</p>
          <p id="latLng">
            Lat: {this.props.markerPosition.lat} Lng:{this.props.markerPosition.lng}
          </p>
          <p id="county">County:{this.props.county} </p>
          <p id="town">Town: {this.props.town} </p>
        </div>
      );
    } 
    {
      return (
        <div id="infoPanel" style = {panelStyle} >
          <p>Score: {this.props.score}</p>
          <p id="latLng">Lat: ? Lng: ? </p>
          <p id="county">County: ? </p>
          <p id="town">Town: ? </p>
        </div>
      );
    }
  }
}

export default InfoPanel;
