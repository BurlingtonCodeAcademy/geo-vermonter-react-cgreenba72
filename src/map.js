import L from "leaflet"
import React from 'react'
import borderData from './border.js'


const style = {
  width: "80%",
  height: "500px",
};

class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [44.5588, -72.5778], 
      zoom: 18,
      layers: [
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
      ]
    });

    // add marker
    this.marker = L.marker(this.props.markerPosition).addTo(this.map);
    const border = L.geoJSON(borderData)
    border.addTo(this.map)
  }
  componentDidUpdate({ markerPosition, mapCenter }) {
    // check if position has changed
    if (this.props.markerPosition !== markerPosition) {
      this.marker.setLatLng(this.props.markerPosition);
    }
    if (this.props.mapCenter !== mapCenter){
      this.map.panTo(this.props.mapCenter)
    }
  }
  render() {
    return <div id="map" style={style} />;
  }
}

export default Map;



  