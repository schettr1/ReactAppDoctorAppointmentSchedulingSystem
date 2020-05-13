import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Subscribe.css';


class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: ''
    };
  }


  // BEFORE: access props in the Child Component
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      show: props.show,
      message: props.message
    },()=>{
      console.log('this.state.show=', this.state.message);
      console.log('this.state.message=', this.state.message);
    });
  }


  /* AFTER: access props in the Child Component
  // Unable to setTimeout() with getDerivedStateFromProps() method
  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps()');
    if (props.show !== state.show) {
      return {
        show: props.show,
        message: props.message
      };
    }
    // Return null to indicate no change to state.
    return null;
  }*/



  // watch change in  state of 'message'
  componentDidUpdate(preProps, prevState){
    if (this.state.message && !prevState.message) {
      setTimeout(() => {
        this.setState({
          message:''
        },()=>{
          this.setState({
            show: false   // reset show to false after 1 seconds
          })
        })
      }, 1500);       // setState of message:'' after 1 seconds of having state.message:'some message!'
    }
  }



  render() {
    // display if this.props.show=true
    if(this.state.show) {
      return (
        <div>
          <div className='container _successMsg'>
            {this.state.message}
          </div>
        </div>
      );
    }
    return null;
  }


}


Subscribe.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string
};

export default Subscribe;
