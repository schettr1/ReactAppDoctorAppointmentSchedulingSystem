import React, { Component } from 'react';

class Error_ConnectionFailed extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.goBack = this.goBack.bind(this);
  }

  render() {
    return(
      <div className="container fluid" style={{textAlign: 'center'}}>
        <h1>500 - Server is Down</h1>
        <br/>
        <div>Check your cable connections or the internet provider</div>
        <br/>
        <br/>
        <br/>
        <button className='btn btn-info sm' onClick={this.goBack}>Try Again</button>
      </div>
    );
  }


  goBack(){
    window.location.reload();    // reload the page
    this.props.history.goBack();      // return to previous path
  }

}


export default Error_ConnectionFailed;
