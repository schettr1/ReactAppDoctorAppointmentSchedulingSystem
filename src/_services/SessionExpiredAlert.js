import React from 'react';

/*
**********************  NOT USED IN THE APPLICATION ***************************
* You can receive props - show and message. When show == true, display the message.
* It can be used to display message to user that the action has been completed when
* creating, updating or deleting. The only downside of using this code is you have
* to handle 2 seconds display time from Parent Component which is why you may as well
* write this piece of code in Parent Component as well.
*/
const AlertMessage = (props) => {    // props = {valid: '', message: ''}

  let _style = {
    position: 'fixed',
    top: 100,
    color: 'white',
    backgroundColor: '#CD5C5C',
    padding: 10,
    borderRadius: 8,
  };

  if (props.show) {
    return(
      <div className='container' style={_style}>{props.message}</div>
    )
  }
  return null;
}

export default AlertMessage;
