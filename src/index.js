import React from 'react';
import ReactDOM from 'react-dom';
import Map from './map.js'
import leafletPip from  '@mapbox/leaflet-pip'
import L from 'leaflet'
import borderData from './border.js'

const wholeThang = {
  display: "flex",

}
const img = {
  height : "500px"
}


class App extends React.Component {
  state = { 
    markerPosition: { lat: 44.5588,lng: -72.5778 },
    mapCenter: {lat: 44.5588, lng: -72.5778},
    town: {}  
  };
  
  startGame = () => {
    document.getElementById("start-button").disabled = true
    document.getElementById("guess-button").disabled = false
    document.getElementById("quit-button").disabled = false
    let randoLat = this.getRandoLat()
    let randoLng = this.getRandoLng()
    let layerArray = leafletPip.pointInLayer ([randoLng, randoLat],L.geoJSON(borderData))
    while (layerArray.length === 0){
      randoLat = this.getRandoLat()
      randoLng = this.getRandoLng()
      layerArray = leafletPip.pointInLayer ([randoLng, randoLat],L.geoJSON(borderData))
    }
    this.setState({
      mapCenter:{
        lat: randoLat,
        lng:randoLng
      },
      markerPosition:{
        lat: randoLat,
        lng:randoLng
    }
  })
  }
  componentDidMount = () => {
    document.getElementById("start-button").disabled = false
    document.getElementById("guess-button").disabled = true
    document.getElementById("quit-button").disabled = true
  }
  getRandoLat = () => {
    let lat = Math.random() * (45.005419 - 42.730315) + 42.730315;
    return lat;
  }
 
  getRandoLng = () => {
    let lng = (Math.random() * (71.510225 - 73.35218) + 73.35218) * -1;
    return lng;
  }

  showLocation = () => {
    document.getElementById('latLng').textContent = `Lat: ${this.state.markerPosition.lat} Lng: ${this.state.markerPosition.lng}`
    document.getElementById('start-button').disabled = false
    this.lookupLocation()
  }

  lookupLocation = () => {
    fetch(`https://nominatim.openstreetmap.org/reverse/?lat=${this.state.markerPosition.lat}&lon=${this.state.markerPosition.lng}&format=json`)
    .then(response => {
      return response.json()
    }) .then(obj => {
      console.log(obj)
      document.getElementById('town').textContent = `Town: ${obj.address.village||obj.address.city||obj.address.hamlet}`
      document.getElementById('county').textContent = `County: ${obj.address.county}`
    })

  }
  
  
  moveNorth = () => {
    const lat = this.state.mapCenter.lat
    const lng = this.state.mapCenter.lng
    this.setState({
      mapCenter: {
        lat: lat + .002,
        lng: lng,
      }
    })
  }
  moveSouth = () => {
    const lat = this.state.mapCenter.lat
    const lng = this.state.mapCenter.lng
    this.setState({
      mapCenter: {
        lat: lat - .002,
        lng: lng,
      }
    })
  }
  moveEast = () => {
    const lat = this.state.mapCenter.lat
    const lng = this.state.mapCenter.lng
    this.setState({
      mapCenter: {
        lat: lat,
        lng: lng + .002
      }
    })
  }
  moveWest = () => {
    const lat = this.state.mapCenter.lat
    const lng = this.state.mapCenter.lng
    this.setState({
      mapCenter: {
        lat: lat,
        lng: lng - .002,
      }
    })
  }

  return = () => {
    const lat = this.state.mapCenter.lat
    const lng = this.state.mapCenter.lng
    this.setState({
      mapCenter: {
        lat: this.state.markerPosition.lat,
        lng: this.state.markerPosition.lng,
      }
    })   
  }


  render() {
    const { markerPosition, mapCenter } = this.state;
    return (
      <div>
      <div style ={wholeThang}> 
        <Map 
        markerPosition={markerPosition} 
        mapCenter = {mapCenter}
        />
    <img class="county-image" style = {img} src="https://geology.com/county-map/vermont-county-map.gif"></img>
    </div>
        <div id = 'infoPanel' >
          <p id = 'latLng'>Lat: ? Lng: ?</p>
          <p id = 'county'>County: ? </p>
          <p id = 'town'>Town: ? </p>
        <button id = 'start-button' onClick={this.startGame} >Start Game</button> 
        <button id = 'guess-button'>Guess Spot</button>
        <button id = 'quit-button' onClick={this.showLocation} >I Give Up</button>
        <button onClick = {this.moveNorth}>Move North</button>
        <button onClick = {this.moveSouth}>Move South</button>
        <button onClick = {this.moveEast}> Move East</button> 
        <button onClick = {this.moveWest}> Move West</button>
        <button onClick = {this.return}>Return to Original Spot</button>
      </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));





