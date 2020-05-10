import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';


class Patient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageOfItems: [],        // list of items in any single page
    };
    this.onChangePage = this.onChangePage.bind(this);
  }


  onChangePage(pageOfItems) {
    this.setState({
      pageOfItems: pageOfItems
    });
  }


  render() {

    // Read props value inside render(). You cannot read its value inside componentDidMount()
    let patients = this.props.patients;

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
            {this.state.pageOfItems.map((item) =>{
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
                  <td>{item.birthdate}</td>
                  <td>{item.gender}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <Button tag={Link} to={"/update_patient/"+item.id} className="btn btn-info">Update</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <Pagination items={patients} onChangePage={this.onChangePage} />
      </div>
    );

  }
}




export default Patient;
