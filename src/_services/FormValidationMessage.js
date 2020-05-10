import React from 'react';

/*
* To determine whether to display form error or not
* @param - props.valid, props.message
* if boolean valid is false, return message
*/
const ValidationMessage = (props) => {    // props = {valid: '', message: ''}
  if (props.valid === false) {
    return(
      <div style={{color: 'red'}}>{props.message}</div>
    )
  }
  return null;
}

export default ValidationMessage;
