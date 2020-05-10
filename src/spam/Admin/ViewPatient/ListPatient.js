import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';



class ListPatient extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return(
      <div>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Firsname</th>
              <th>Lastname</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.patients.map((item, i) =>{
              return (
                <tr key={i}>
                  <td>{this.props.patients[i].id}</td>
                  <td>{this.props.patients[i].firstname}</td>
                  <td>{this.props.patients[i].lastname}</td>
                  <td>{this.props.patients[i].birthdate}</td>
                  <td>{this.props.patients[i].gender}</td>
                  <td>{this.props.patients[i].email}</td>
                  <td>{this.props.patients[i].phone}</td>
                  <td>
                    <Button tag={Link} to={"/register/"+this.props.patients[i].id} className="btn btn-info">Update</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );

  }
}




export default ListPatient;
