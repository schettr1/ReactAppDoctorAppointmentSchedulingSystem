import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Error_PageNotFound.css';

class Error_PageNotFound extends Component {

    render() {
        return (
          <div className='page_not_found'>
            <h1>Oops! Connection Error. Check your internet or cable connections. </h1>
            <div className='link'>
              <Link to="/#">Try Again</Link>
            </div>
          </div>
        )
    }
}
export default Error_PageNotFound;
