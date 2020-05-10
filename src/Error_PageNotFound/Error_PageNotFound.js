import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Error_PageNotFound.css';

class Error_PageNotFound extends Component {

    render() {
        return (
          <div className='page_not_found'>
            <h1>404 Page Not Found</h1>
            <div className='link'>
              <Link to="/home">Go to Home </Link>
            </div>
          </div>
        )
    }
}
export default Error_PageNotFound;
