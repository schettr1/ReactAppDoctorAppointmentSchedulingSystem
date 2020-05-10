import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class TableRow extends Component {

  constructor(props) {
      super(props);
      this.onDelete = this.onDelete.bind(this);
  }

  onDelete(e) {
    e.preventDefault();
    axios.delete('/delete/'+this.props.propsName.employee.id)    // proxy used is 'http://localhost:8080'
      .then(response => {
        console.log("id " + this.props.propsName.employee.id + " is deleted");
        this.props.history.push('/groups');     // redirect to url '/groups'
      })
      .catch(function (error) {
        console.log(error);
      })

  }


  render() {
    return (
        <tr>
          <td>
            {this.props.propsName.employee.firstname}
          </td>
          <td>
            {this.props.propsName.employee.lastname}
          </td>
          <td>
            {this.props.propsName.employee.email}
          </td>
          <td>
            {this.props.propsName.employee.username}
          </td>
          <td>
            <Button tag={Link} to={"/create/"+this.props.propsName.employee.id} color="primary">Update</Button>
          </td>
          <td>
            <button onClick={this.onDelete} className="btn btn-danger">Delete</button>
          </td>
        </tr>
    );
  }
}

export default withRouter(TableRow);
