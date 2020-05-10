import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBlock, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import axios from 'axios';

import PatientNavbar from '../PatientNavbar/PatientNavbar';
import './SearchDoctor.css';


class SearchDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      _doctor: '',
      isOpen: false
    };

    this.toggleModal= this.toggleModal.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    let response_data = [
      {id: 1, firstname: 'Rajesh', lastname: 'Khanna', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Johns Hopkins Hospital, MD', category: 'Cardiologist', rating: 4.0},
      {id: 2, firstname: 'Amisha', lastname: 'Patel', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Harvard Medical University, MD', category: 'General Physician', rating: 4.2},
      {id: 3, firstname: 'Hrithik', lastname: 'Roshan', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Yale University, MD, MD', category: 'Gynecologist', rating: 4.7},
      {id: 4, firstname: 'Sashi', lastname: 'Kapoor', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Johns Hopkins Hospital, MD', category: 'Pediatric', rating: 4.0},
      {id: 5, firstname: 'Binod', lastname: 'Khanna', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Virginia Medical Universiry, MD, MD, MD', category: 'Neurologist', rating: 4.1},
      {id: 6, firstname: 'Amrita', lastname: 'Arora', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Yale University, MD, MD', category: 'Cardiologist', rating: 4.2},
      {id: 7, firstname: 'Madhuri', lastname: 'Dixit', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Johns Hopkins Hospital, MD', category: 'Pediatric', rating: 4.0},
      {id: 8, firstname: 'Ajay', lastname: 'Devgan', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Harvard Medical University, MD, MD', category: 'Orthopedic', rating: 4.5},
      {id: 9, firstname: 'Sunil', lastname: 'Shetty', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Virginia Medical Universiry, MD, MD', category: 'General Physician', rating: 4.5},
    ]
    this.setState({
      doctors: response_data
    }, ()=> {
      console.log(this.state.doctors);
    })

  }

  render() {
    return(
      <div>
        <PatientNavbar/>               {/* patient home page navigation bar */}
        <h1>List Doctors</h1>
        <h1>List Doctors</h1>
        <div className="searchPanel">
          <div className="floatRight">
            <label>Search: </label>
            <input type='field' onSubmit={this.addCompany} />
          </div>
        </div>
        {this.state.doctors.map((item, i) =>{
          return (
            <div key={i} className='horizontalDivs rows'>
              <div>
                <img style={imageProperty} src='https://www.nanx.com.pk/wp-content/uploads/2017/01/istockphoto-476085198-612x612.jpg' alt="No image available" />
              </div>
              <div>
                <div>{this.state.doctors[i].firstname + ' ' + this.state.doctors[i].lastname}</div>
                <div>{this.state.doctors[i].category}</div>
                <div>{this.state.doctors[i].degree}</div>
                <div>
                  <div><img style={icon} src='/images/email.jpg' alt="star_logo"/> {this.state.doctors[i].email}</div>
                  <div><img style={icon} src='/images/phone.png' alt="star_logo"/> {this.state.doctors[i].phone}</div>
                </div>
              </div>
              <div>
                <div>
                  {'Rating:' + (this.state.doctors[i].rating)} <img style={icon} src='/images/star.png' alt="star_logo"/>
                </div>
                <div>
                  <Button tag={Link} to={"/book_appointment/"+this.state.doctors[i].id} className="btn btn-info">Make Appointment</Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );

  }

  filterList(event) {
      var updatedList = this.state.doctors;
      updatedList = updatedList.filter(function(item){
        return item.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
      });
      this.setState({
        doctors: updatedList
      });
    }

}

let row = {
    width: 100,
    height: 200,
    border: 2
};

let imageProperty = {
    width: 200,
    height: 200
};

let icon = {
    width: 18,
    height: 18
};


export default SearchDoctor;


import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import PatientNavbar from '../PatientNavbar/PatientNavbar';
import ListDoctors from './ListDoctors/ListDoctors';
import './SearchDoctor.css';


class SearchDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      searchText: ''
    };

    this.filterList = this.filterList.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    let response_data = [
      {id: 1, firstname: 'Rajesh', lastname: 'Khanna', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Johns Hopkins Hospital, MD', category: 'Cardiologist', rating: 4.0},
      {id: 2, firstname: 'Amisha', lastname: 'Patel', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Harvard Medical University, MD', category: 'General Physician', rating: 4.2},
      {id: 3, firstname: 'Hrithik', lastname: 'Roshan', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Yale University, MD, MD', category: 'Gynecologist', rating: 4.7},
      {id: 4, firstname: 'Sashi', lastname: 'Kapoor', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Johns Hopkins Hospital, MD', category: 'Pediatric', rating: 4.0},
      {id: 5, firstname: 'Rajnish', lastname: 'Khanna', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Virginia Medical Universiry, MD, MD, MD', category: 'Neurologist', rating: 4.1},
      {id: 6, firstname: 'Amrita', lastname: 'Arora', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Yale University, MD, MD', category: 'Cardiologist', rating: 4.2},
      {id: 7, firstname: 'Madhuri', lastname: 'Dixit', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Johns Hopkins Hospital, MD', category: 'Pediatric', rating: 4.0},
      {id: 8, firstname: 'Ajay', lastname: 'Devgan', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Harvard Medical University, MD, MD', category: 'Orthopedic', rating: 4.5},
      {id: 9, firstname: 'Sunil', lastname: 'Shetty', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', degree: 'Virginia Medical Universiry, MD, MD', category: 'General Physician', rating: 4.5},
    ]
    this.setState({
      doctors: response_data
    }, ()=> {
      console.log(this.state.doctors);
    })

  }

  render() {
    const searchText = this.state.searchText.toLowerCase();
    const updatedList = this.state.doctors.filter(function(item) {
      return (
        Object.keys(item).some(key =>
                  item[key].toString().toLowerCase().includes(searchText))
      );
    });
    return(
      <div>
        <PatientNavbar/>               {/* patient home page navigation bar */}
        <div className="searchPanel">
          <div className="filter-list">
            <form>
              <div className="searchBox">
                <input type="text" value={this.state.searchText} placeholder='Search' className="form-control form-control-lg" onChange={this.filterList}/>
              </div>
            </form>
            {updatedList.map((item, i) =>{
              return (
                <div key={i} className='horizontalDivider divStyle'>
                  <div>
                    <img style={imageProperty} src='https://www.nanx.com.pk/wp-content/uploads/2017/01/istockphoto-476085198-612x612.jpg' alt="No image available" />
                  </div>
                  <div>
                    <div>{updatedList[i].firstname + ' ' + updatedList[i].lastname}</div>
                    <div>{updatedList[i].category}</div>
                    <div>{updatedList[i].degree}</div>
                    <div>
                      <div><img style={icon} src='/images/email.jpg' alt="No Image Available"/> {updatedList[i].email}</div>
                      <div><img style={icon} src='/images/phone.png' alt="No Image Available"/> {updatedList[i].phone}</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      {'Rating:' + (updatedList[i].rating)} <img style={icon} src='/images/star.png' alt="No Image Available"/>
                    </div>
                    <div>
                      <Button tag={Link} to={"/book_appointment/"+updatedList[i].id} className="btn btn-info">Make Appointment</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );

  }

  filterList(event) {
    this.setState({
      searchText: event.target.value
    });
  }

}

let row = {
    width: 100,
    height: 200,
    border: 2
};

let imageProperty = {
    width: 200,
    height: 200
};

let icon = {
    width: 18,
    height: 18
};
export default SearchDoctor;
