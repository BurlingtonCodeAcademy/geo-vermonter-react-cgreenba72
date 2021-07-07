import React from "react";
import Modal from "react-modal";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


class TheModal extends React.Component {
  render() {
    if (this.props.modalOpen) {
      return (
        <Modal style = {customStyles}>
          <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      )
    }
    return (
      <dialog id="favDialog">
      </dialog>
    );
  }
}

export default TheModal;
