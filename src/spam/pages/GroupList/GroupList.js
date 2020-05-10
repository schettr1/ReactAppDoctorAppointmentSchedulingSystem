import React, { Component } from 'react';
import axios from 'axios';

import AppNavbar from '../AppNavbar/AppNavbar';
import TableRow from './TableRow/TableRow';

class GroupList extends Component {

  constructor(props) {
    super(props);
    this.state = {employees: []};
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/getAll')          // proxy used is 'http://localhost:8080'
      .then(response => {
        this.setState({ employees: response.data });
        console.log(this.state.employees);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  tabRow(){
    if(this.state.employees.length > 0) {
      return this.state.employees.map(function(object, i){
        return <TableRow propsName={object} key={i} />;
      });
    }
  }

  render() {
    return(
      <div>
        <AppNavbar/>
        <div>
        <h3 align="center">GroupList</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Email</th>
              <th>Username</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            { this.tabRow() }
          </tbody>
        </table>
      </div>
    </div>
    );

  }
}

export default GroupList;
