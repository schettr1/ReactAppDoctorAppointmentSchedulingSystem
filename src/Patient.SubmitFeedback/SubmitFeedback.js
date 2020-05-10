import React, { Component } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './SubmitFeedback.css';

class SubmitFeedback extends Component {

  constructor(props) {
    super(props);
    this.state = {
      feedback: {
        id: '',
        date: '',
        message: ''
      },
      successMsg : '',
    };
    this.onSubmitFeedback = this.onSubmitFeedback.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  async componentDidMount(){

  }

  // update in this.state.successMsg will be detected
  componentDidUpdate(_, prevState){
    if (this.state.successMsg && !prevState.successMsg) {
      setTimeout(() => {
        this.setState({
          successMsg:''
        })
      }, 2000);       // setState of successMsg:'' after 2 seconds of having state.successMsg:'Thankyou for the feedabck!'
    }
  }



  render() {
    return(
      <div>
        <Navbar/>               {/* patient home page navigation bar */}
        <div className='container'>
          <div className='feedback-container'>
            <div className='feedbackBox'>
              <h2>Feedback</h2>
              <br/>
              <form onSubmit={this.onSubmitFeedback}>
                <textarea className='textArea' placeholder="Enter text" value={this.state.feedback.message} onChange={this.onChangeMessage}>
                </textarea>
                <div>
                  <input type='submit' className='button btn btn-primary' disabled={!this.state.feedback.message}/>
                  <input type='reset' className='button btn btn-primary' onClick={this.clearForm} style={{marginLeft: 20}} />
                </div>
              </form>
            </div>
          </div>

          {/* style={position:'fixed' & top:'75px'}
           *  Even if you scroll the page all the way down or shrink the page height, message will display at the same position.
           *  To position the stacking order of elements place this code below form elements
          */}
          {this.state.successMsg ?
            <div className='container successMsg'>
                {this.state.successMsg}
            </div>
            : null
          }

        </div>
      </div>
    );

  }


  /* Submit Feedback to the Server
   */
  onSubmitFeedback(e) {
    e.preventDefault();
    let _now = new Date();
    //console.log('_now=', _now);
    this.setState(prevState => ({
      feedback: {
        ...prevState.feedback,
        date: _now
      }
    }), ()=> {
      let _feedback = this.state.feedback;
      // POST feedback to the Server
      axios.post('/patient/save_feedback', _feedback)
          .then(response => {
            console.log(response.data);
            // clear the form
            this.clearForm();
            // display success message
            this.setState({
              successMsg: 'Thank you for the feedback!'
            },()=>{
              console.log('this.state.successMsg', this.state.successMsg);
            })
          })
          .catch(function (error) {
            console.log(error);
          })
    });
  }


  onChangeMessage(e) {
    let _message = e.target.value;
    this.setState(prevState => ({
      feedback: {
        ...prevState.feedback,
        message: _message
      }
    }));
  }

  clearForm() {
    // clear the form after Submit
    this.setState(prevState => ({
      feedback: {
        ...prevState.feedback,
        message: ''
      }
    }),()=>{
      console.log('message=', this.state.feedback.message);
    });
  }
}

export default SubmitFeedback;
