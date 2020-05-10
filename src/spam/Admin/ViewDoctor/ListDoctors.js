import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';



class ListDoctors extends Component {

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
              <th>Degree</th>
              <th>Category</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.doctors.map((item, i) =>{
              return (
                <tr key={i}>
                  <td>{this.props.doctors[i].id}</td>
                  <td>{this.props.doctors[i].firstname}</td>
                  <td>{this.props.doctors[i].lastname}</td>
                  <td>{this.props.doctors[i].degrees}</td>
                  <td>{this.props.doctors[i].category}</td>
                  <td>{this.props.doctors[i].gender}</td>
                  <td>{this.props.doctors[i].birthdate}</td>
                  <td>{this.props.doctors[i].email}</td>
                  <td>{this.props.doctors[i].phone}</td>
                  <td>
                    <Button tag={Link} to={"/admin/add_doctor/"+this.props.doctors[i].id} className="btn btn-info">Update</Button>
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


export default ListDoctors;
