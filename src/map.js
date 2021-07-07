import L from "leaflet"
import React from 'react'
import borderData from './border.js'

const style = {
  height: "600px",
};
const borderStyle = {
  fillOpacity: 0
}

let moveHistory = []

class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [44, -72.5778], 
      zoom: 7,
      layers: [
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
      ]
    });
    // add marker
    this.marker = L.marker(this.props.markerPosition).addTo(this.map);
    // add border
    const border = L.geoJSON(borderData)
    border.addTo(this.map)
    border.setStyle(borderStyle)
    // removes old line
  }
  componentDidUpdate({ markerPosition, mapCenter }) {
    // check if position has changed
    if (this.props.markerPosition !== markerPosition) {
      this.marker.setLatLng(this.props.markerPosition);
      this.map.zoomIn(50)
    }
    if (this.props.mapCenter !== mapCenter){
      this.map.panTo(this.props.mapCenter)
      moveHistory.push(this.props.mapCenter)
      const line = L.polyline([moveHistory], {color: 'green'}).addTo(this.map)
    }
    if (!this.props.gameStart) {
      moveHistory = []
      }
   this.map.removeControl(this.map.zoomControl)
   this.map.touchZoom.disable()
   this.map.dragging.disable()
   this.map.doubleClickZoom.disable()
   this.map.scrollWheelZoom.disable()
   this.map.boxZoom.disable()
   this.map.keyboard.disable()
  }
  render() {
    return <div id="map" style={style} />;
  }
}

export default Map;



  