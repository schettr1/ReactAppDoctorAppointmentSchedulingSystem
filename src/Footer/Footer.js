import React, { Component } from 'react';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = ({
    });
  }

  render() {
      return(
        <div style={footerStyle}>
          Thank you for visiting us!
        </div>
      );
  }

}

let footerStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  fontFamily: "lucida handwriting",
  fontSize: 12,
  padding: 10,
  textAlign: 'center',
  backgroundColor: 'lightGray'
};

export default Footer;
