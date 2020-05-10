import React from 'react';
import PropTypes from 'prop-types';


class ModalCheckStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  async componentDidMount(){
    // nothing
    console.log('this.props.appointmentId=', this.props.appointmentId);
  }


  render() {
    // return null if the "this.props.show" is false
    if(!this.props.show) {
      return null;
    }
    // if "this.props.show" is true render this
    return (
      <div style={backgroundStyle}>
        <div style={modalStyle}>
          <div>
            <h2>Appointment Status Info:</h2>
          </div>
              <hr/>
          <div style={content}>
            {this.props.children}              {/* displays content from Parent Component inside <Modal> tags */}
          </div>
              <hr/>
          <div>
            <button className="btn btn-primary"
                    style={footer}
                    disabled={this.props.status === 'BOOKED' ? false : true}
                    onClick={this.props.onUpdateStatus} >Receive</button>
            <button className="btn btn-primary"
                    style={footer}
                    onClick={this.props.onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

}


ModalCheckStatus.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  appointmentId: PropTypes.number,
  status: PropTypes.string,
  children: PropTypes.node
};

// The background behind modal 'window'. Change 4th value of rgba() to adjust background opacity
let backgroundStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.025)',
  padding: 50
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
  boxShadow: '3px 4px 4px 2px rgba(0,0,0,0.03)'
};

let content = {
  marginBottom: 80,
}

let footer = {
  margin: '10px 10px'
}


export default ModalCheckStatus;
