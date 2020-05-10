import React from 'react';
import PropTypes from 'prop-types';


class ModalConfirmation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  async componentDidMount(){
    let show=this.props.show;
    console.warn('show=', show);
  }

  render() {

    // The background behind modal 'window'
    let backgroundStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    let modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };

    let content = {
      marginBottom: 80,
    }

    let footer = {
      margin: '10px 10px'
    }

    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // if the "show" prop is true render this
    return (
      <div style={backgroundStyle}>
        <div style={modalStyle}>
          <div>
            <h2>Cancel Appointment</h2>
          </div>
              <hr/>
          <div style={content}>
            {this.props.children}               {/* displays text from Parent Component inside <Modal> tags */}
          </div>
              <hr/>
          <div>
            <button className="btn btn-primary" style={footer} onClick={this.props.onCancel}>Yes</button>
            <button className="btn btn-primary" style={footer} onClick={this.props.onClose}>No</button>
          </div>
        </div>
      </div>
    );
  }

}


ModalConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default ModalConfirmation;
