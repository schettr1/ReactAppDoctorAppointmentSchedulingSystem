import React from 'react';
import PropTypes from 'prop-types';


class ModalAppointmentDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // if the "show" prop is true render this
    return (
      <div style={backgroundStyle}>
        <div style={modalStyle}>
          <div>
            <h2>Appointment Details:</h2>
          </div>
              <hr/>
          <div style={content}>
            {this.props.children}              {/* displays text from Parent Component inside <Modal> tags */}
          </div>
              <hr/>
          <div>
            <button className="btn btn-primary" style={footer} onClick={this.props.onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

}


ModalAppointmentDetail.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

// The background behind modal 'window', backgroundColor equals the opacity/transparency of background
let backgroundStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.07)',
  padding: 50,
};

// The modal "window"
let modalStyle = {
  backgroundColor: '#fff',
  borderRadius: 5,
  maxWidth: 500,
  minHeight: 300,
  margin: '0 auto',
  marginTop: 40,
  padding: 30,
  boxShadow: '4px 5px 5px 3px rgba(0,0,0,0.07)'
};

let content = {
  marginBottom: 80,
}

let footer = {
  margin: '10px 10px'
}

export default ModalAppointmentDetail;
