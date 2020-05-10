import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import PatientNavbar from '../PatientNavbar/PatientNavbar';
import './Feedback.css';

class Feedback extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.onSubmitFeedback = this.onSubmitFeedback.bind(this);
  }

  async componentDidMount(){

  }

  render() {
    return(
      <div>
        <PatientNavbar/>               {/* patient home page navigation bar */}
          <div className='feedback-container'>
            <div className='feedbackBox'>
              <h2>Feedback</h2>
              <textarea className='textArea' placeholder="Enter text" >
              </textarea>
              <input type='button' className='button btn btn-primary' value="Submit" onClick={this.onSubmitFeedback} />
            </div>
          </div>
      </div>
    );

  }

  onSubmitFeedback(event) {

  }
}

export default Feedback;
