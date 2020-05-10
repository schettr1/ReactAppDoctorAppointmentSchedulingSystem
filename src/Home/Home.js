import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Home.css';
import { convertStringUTCDatetoBirthdate } from '../_services/Converter.js';


class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: ''
    };
    this.renewAccessToken = this.renewAccessToken.bind(this);
  }


  async componentDidMount(){

    /*
    * TWO-FACTOR VERIFICATION
    * read https://www.baeldung.com/spring-security-two-factor-authentication-with-soft-token
    */

    /*
    // check whether user has been verified using PIN if logging in for the first time
    if(localStorage.getItem('loggedUser')) {
      let isVerifiedUser = JSON.parse(localStorage.getItem('loggedUser')).isVerified;
      if(!isVerifiedUser) {
        this.props.history.push('/verify_user/' + JSON.parse(localStorage.getItem('loggedUser')).userId);
      }
    }
    */
    var userId = JSON.parse(localStorage.getItem('loggedUser')).userId;
    axios.get('/user/get_user_by_id/' + userId)
      .then(response => {
        let user = response.data;   // {user: {id: '', firstname: '', ...}, links: ''}
        user = user.user;         // {id: '', firstname: '', ...}
        user.birthdate = convertStringUTCDatetoBirthdate(user.birthdate);  // birthdate was saved into database as Date object instead of String UTC, so use new Date(utc) instead of using substring()
        this.setState({
          user: user
        },()=>{
          console.log('user=', this.state.user);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  render() {
    return(
      <div className='container fluid'>
        <div>
          <h2>Profile</h2>
        </div>
        <div className='container'>
          <table className='table table-bordered'>
            <tbody>
              <tr>
                <td>Name</td><td>{this.state.user.firstname + ' ' + this.state.user.lastname + ' ' +
                                                (this.state.user.degrees ? this.state.user.degrees : '')}

                </td>
              </tr>

              {this.state.user.category ?
              <tr>
                <td>Category</td><td>{this.state.user.category}</td>
              </tr>
              : null}

              <tr>
                <td>Email</td><td>{this.state.user.email}</td>
              </tr>
              <tr>
                <td>Phone</td><td>{this.state.user.phone}</td>
              </tr>
              <tr>
                <td>Birthdate</td><td>{this.state.user.birthdate}</td>
              </tr>
              <tr>
                <td>Username</td><td>{this.state.user.username}</td>
              </tr>
            </tbody>
          </table>
          <div className="buttonStyle">
            {JSON.parse(localStorage.getItem('loggedUser')).role.includes('ROLE_PATIENT')
                  && <Button color="primary" tag={Link} to={"/update_patient/"+ this.state.user.id}>Update</Button>}
            {JSON.parse(localStorage.getItem('loggedUser')).role.includes('ROLE_DOCTOR')
                  && <Button color="primary" tag={Link} to={"/update_doctor/"+ this.state.user.id}>Update</Button>}
          </div>
        </div>
      </div>
    );

  }


  // renew renew access_token
  renewAccessToken() {
    axios
    .post('/user/renew_access_token', null, {
        headers: {
            "Authorization" : "Bearer " + JSON.parse(localStorage.getItem('loggedUser')).refresh_token
        }
    })
    .then(response => {
      console.log('localStorage.getItem(loggedUser)=', localStorage.getItem('loggedUser'));     // original token
      console.log('response.data=', JSON.stringify(response.data));     // renewed token
      localStorage.setItem('loggedUser', JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log('error=', error);
    })
  }

}   /* END OF CLASS */

export default Home;
