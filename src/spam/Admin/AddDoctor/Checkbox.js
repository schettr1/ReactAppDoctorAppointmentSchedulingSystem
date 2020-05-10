/*
import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', name = '', checked = false, onChange = ''}) => (
  <input className='checkBoxStyle' type={type} name={name} checked={checked} onChange={onChange} />
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox;
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <input className='checkBoxStyle'
              type='checkbox'
              name={this.props.name}
              checked={this.props.checked || false}
              onChange={this.props.onChange} />
    );
  }

}

/*
* 'name' is declared type 'number' to match integer value in degrees.js
* REST api is declared as int[] degrees as well. Even if you declare 'name'
* as string type, Rest api still converts the String to Integer automatically.
* You only have to deal with converting String value to Integer value using parseInt(String).
*/
Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.number.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox;
