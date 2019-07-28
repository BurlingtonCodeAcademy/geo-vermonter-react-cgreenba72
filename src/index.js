import React from "react";
import ReactDOM from "react-dom";
import Map from "./map.js";
import InfoPanel from "./infoPanel.js";
import leafletPip from "@mapbox/leaflet-pip";
import L from "leaflet";
import borderData from "./border.js";
import Modal from "react-modal";

class App extends React.Component {
  state = {
    markerPosition: { lat: 44.5588, lng: -72.5778 },
    mapCenter: { lat: '?', lng: '?' },
    town: "?",
    county: "?",
    score: 100,
    gameStart: false,
    giveUp: false,
    modalOpen: false
  };

  startGame = () => {
    this.gameStart();
    document.getElementById("start-button").disabled = true;
    document.getElementById("guess-button").disabled = false;
    document.getElementById("quit-button").disabled = false;
    let randoLat = this.getRandoLat();
    let randoLng = this.getRandoLng();
    let layerArray = leafletPip.pointInLayer(
      [randoLng, randoLat],
      L.geoJSON(borderData)
    );
    while (layerArray.length === 0) {
      randoLat = this.getRandoLat();
      randoLng = this.getRandoLng();
      layerArray = leafletPip.pointInLayer(
        [randoLng, randoLat],
        L.geoJSON(borderData)
      );
    }
    this.setState({
      mapCenter: {
        lat: randoLat,
        lng: randoLng
      },
      markerPosition: {
        lat: randoLat,
        lng: randoLng
      }
    });
  };
  componentDidMount = () => {
    document.getElementById("start-button").disabled = false;
    document.getElementById("guess-button").disabled = true;
    document.getElementById("quit-button").disabled = true;
  };
  componentDidUpdate = () => {
    console.log(this.state.score);
    console.log(this.state.modalOpen);
  };
  getRandoLat = () => {
    let lat = Math.random() * (45.005419 - 42.730315) + 42.730315;
    return lat;
  };

  getRandoLng = () => {
    let lng = (Math.random() * (71.510225 - 73.35218) + 73.35218) * -1;
    return lng;
  };

  showLocation = () => {
    document.getElementById("latLng").textContent = `Lat: ${
      this.state.markerPosition.lat
    } Lng: ${this.state.markerPosition.lng}`;
    document.getElementById("start-button").disabled = false;
    this.lookupLocation();
    this.gaveUp();
  };

  lookupLocation = () => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse/?lat=${
        this.state.markerPosition.lat
      }&lon=${this.state.markerPosition.lng}&format=json`
    )
      .then(response => {
        return response.json();
      })
      .then(obj => {
        console.log(obj);
        let town =
          obj.address.village ||
          obj.address.city ||
          obj.address.hamlet ||
          obj.address.town;
        let county = obj.address.county;
        this.setState({
          town: town,
          county: county
        });
      });
  };

  gaveUp = () => {
    this.setState({
      giveUp: true
    });
  };

  gameStart = () => {
    this.setState({
      score: 100,
      gameStart: true,
      giveUp: false,
      county: "?",
      town: '?',
      markerPosition:{
        lat: "?",
        lng: "?"
      }
    });
  };


  moveNorth = () => {
    const lat = this.state.mapCenter.lat;
    const lng = this.state.mapCenter.lng;
    const score = this.state.score;
    this.setState({
      mapCenter: {
        lat: lat + 0.002,
        lng: lng
      },
      score: score - 1
    });
  };

  moveSouth = () => {
    const score = this.state.score;
    const lat = this.state.mapCenter.lat;
    const lng = this.state.mapCenter.lng;
    this.setState({
      mapCenter: {
        lat: lat - 0.002,
        lng: lng
      },
      score: score - 1
    });
  };
  moveEast = () => {
    const score = this.state.score;
    const lat = this.state.mapCenter.lat;
    const lng = this.state.mapCenter.lng;
    this.setState({
      mapCenter: {
        lat: lat,
        lng: lng + 0.002
      },
      score: score - 1
    });
  };
  moveWest = () => {
    const score = this.state.score;
    const lat = this.state.mapCenter.lat;
    const lng = this.state.mapCenter.lng;
    this.setState({
      mapCenter: {
        lat: lat,
        lng: lng - 0.002
      },
      score: score - 1
    });
  };

  return = () => {
    const lat = this.state.mapCenter.lat;
    const lng = this.state.mapCenter.lng;
    this.setState({
      mapCenter: {
        lat: this.state.markerPosition.lat,
        lng: this.state.markerPosition.lng
      }
    });
  };

  handleOpenModal = () => {
    this.setState({ modalOpen: true })
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  };

  handleGuess = (e) => {
    const score = this.state.score
    this.lookupLocation()
    let guess = document.getElementById('selectedOption').value
    if (this.state.county.includes(guess)) {
        this.subtitle.textContent = `CORRECT.. YOU WIN!! Score: ${this.state.score}`
        document.getElementById('modalGuess').disabled = true
    } else {
      this.subtitle.textContent = "WRONG.. GUESS AGAIN"
      this.setState({
        score: score - 1
      })
    }
    }

  render() {
    let style = {}
    if (this.state.modalOpen) {
      style = {filter: 'blur(3px)'} 
    } else{ style = {}
    }

    const img = {
      height: "500px"
    };
    
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        zIndex: '500'
        
      }
    };
    let mapWrapper= {
      width: '75%',
      height: '500px'
    }
    let onScreenStyle = {
      display: 'flex',
    }
    let navBarStyle= {
      display: 'flex',
    }

    let buttonBlockStyle = {
      marginTop : '50px'
    }

    const {
      markerPosition,
      mapCenter,
      giveUp,
      town,
      county,
      score,
    } = this.state;
    return (
  <div id="app" style={style}>
      <div id='navBar'>
        <InfoPanel
          markerPosition={markerPosition}
          giveUp={giveUp}
          town={town}
          county={county}
          score={score}
          />
      </div>
      <div id = "onScreen" style = {onScreenStyle}>
      <div id="map" style = {mapWrapper} >
        <Map markerPosition={markerPosition} mapCenter={mapCenter} />
        </div>
          <img
            class="county-image"
            style={img}
            src="https://geology.com/county-map/vermont-county-map.gif"
            />
            </div> 
        <Modal
          style={customStyles}
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}>Which Vermont County Are You Looking At?</h2>
          <p>
            <label>
               Make a Guess: 
              <select id = "selectedOption">
                <option>Addison</option>
                <option>Bennington</option>
                <option>Caladonia</option>
                <option>Chittenden</option>
                <option>Essex</option>
                <option>Franklin</option>
                <option>Grand Isle</option>
                <option>Lamoille</option>
                <option>Orange</option>
                <option>Orleans</option>
                <option>Rutland</option>
                <option>Washington</option>
                <option>Windham</option>
                <option>Windsor</option>
              </select>
            </label>
          </p>
          <button id= "modalClose"  onClick={this.handleCloseModal}>Close Modal</button>
          <button id = "modalGuess" onClick = {this.handleGuess}>Guess</button>
        </Modal>

        

        <div id ="button nav" style ={buttonBlockStyle}>
          <button id="start-button" onClick={this.startGame}>
            Start Game
          </button>
          <button id="guess-button" onClick={this.handleOpenModal}>
            {" "}
            Guess Spot
          </button>
          <button id="quit-button" onClick={this.showLocation}>
            I Give Up
          </button>
          <button onClick={this.moveNorth}>Move North</button>
          <button onClick={this.moveSouth}>Move South</button>
          <button onClick={this.moveEast}> Move East</button>
          <button onClick={this.moveWest}> Move West</button>
          <button onClick={this.return}>Return to Original Spot</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
