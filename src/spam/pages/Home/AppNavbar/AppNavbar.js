import React, { Component } from 'react';
import './AppNavbar.css';

class AppNavbar extends Component {
  render() {
    return(
      <header className="toolbar">
        <nav className="toolbar__navigation">
          <div className="toolbar__logo"><a href="/">THE LOGO</a></div>
          <div className="spacer"/>
          <div className="toolbar_navigation-items">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/create/0">Create</a></li>
              <li><a href="/groups">GroupsList</a></li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default AppNavbar;
