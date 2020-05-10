import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './AdminDetail.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import CameraFeed from './CameraFeed';
//import WebCam from './WebCam';


class AdminDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      _Blob: '',
      hasImage: false
    };
    this.onTakePhoto = this.onTakePhoto.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/getOnly/1')    // proxy object 'http://localhost:8080/' defined in package.json
      .then(response => {
        this.setState({
          admin: {
            id: 999,
            firstname: 'Surya',
            lastname: 'Chettri',
            email: 'suny4evers@hotmail.com',
            username: 'surya',
            password: 'chettri'
          } });
        console.log(this.state.admin);
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  render() {
    return(
      <div>
        <AdminNavbar/>               {/* patient home page navigation bar */}
        <div className='container fluid'>
          <h2>Details</h2>
          <div className='main-container'>
            <div className="left-div">
                <Table>
                  <tbody>
                    <tr>
                      <td>Firstname</td><td>{this.state.admin.firstname}</td>
                    </tr>
                    <tr>
                      <td>Lastname</td><td>{this.state.admin.lastname}</td>
                    </tr>
                    <tr>
                      <td>Email</td><td>{this.state.admin.email}</td>
                    </tr>
                    <tr>
                      <td>Username</td><td>{this.state.admin.username}</td>
                    </tr>
                    <tr>
                      <td>Password</td><td>{this.state.admin.username}</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="buttonStyle">
                  <Button color="primary" tag={Link} to="/edit">Edit</Button>
                </div>
            </div>
            <div className="right-div">
              <div className="videoRecorder">
                {this.state.hasImage && <CameraFeed _Blob={uploadImage} /> }
              </div>
              {!this.state.hasImage && <img style={imageProperty} src='/images/person.png' alt="" />}
              {!this.state.hasImage && <input type='button' className='btn btn-info' value='Update Photo' onClick={this.onTakePhoto}/>}
            </div>
          </div>
        </div>
      </div>
    );

  }

  onTakePhoto() {
    this.setState({
      hasImage: !this.state.hasImage
    });
  }
}

let imageProperty = {
    width: 200,
    height: 200
};

// Upload to local seaweedFS instance
const uploadImage = async file => {
    const formData = new FormData();
    formData.append('file', file);

    // Connect to a seaweedfs instance
};

export default AdminDetail;
