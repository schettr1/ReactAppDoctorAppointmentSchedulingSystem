import React, { Component } from 'react';
import './AdminDetail.css';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

export class CameraFeed extends Component {

    /**
     * On mount, grab the users connected devices and process them
     * @memberof CameraFeed
     * @instance
     * @override
     */
    async componentDidMount() {
      let playPromise = this.videoPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
          // We can now safely pause video...
          this.videoPlayer.pause();
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }
      const cameras = await navigator.mediaDevices.enumerateDevices();
      this.processDevices(cameras);
    }

    /**
     * Handles taking a still image from the video feed on the camera
     * @memberof CameraFeed
     * @instance
     */
    takePhoto = () => {
        const { _Blob } = this.props;
        const context = this.canvas.getContext('2d');
        context.drawImage(this.videoPlayer, 0, 0, 300, 400);
        //this.canvas.toBlob(sendFile);

        /* convert Canvas to Blob */
        this.canvas.toBlob(function(_Blob) {
          Link.href = URL.createObjectURL(_Blob);
          console.log('_Blob=', _Blob);
          console.log('Link.href=', Link.href); // this line should be here

          /* convert Blob to Base64 */
          var reader = new FileReader();
          reader.readAsDataURL(_Blob);
          reader.onloadend = function() {
            var base64data = reader.result;
            console.log('base64data=', base64data);
          }

          /* POST base64 data from here */

        },'image/png');

        this.props.history.push('/admin');    /* jump to url '/admin'. Hoepfully, the image will be retrieved from the database and displayed */

    };


    render() {
        return (
            <div className="c-camera-feed">
                <div className="c-camera-feed__viewer">
                    <video ref={ref => (this.videoPlayer = ref)} width="300" heigh="400" />
                </div>
                <div className='takePhotoBtn'>
                  <input type='button' className='btn btn-info' value='Take Photo' onClick={this.takePhoto}/>
                </div>
                <div className="c-camera-feed__stage">
                    <canvas width="300" height="400" ref={ref => (this.canvas = ref)} />
                </div>
            </div>
        );
    }

    /**
     * Processes available devices and identifies one by the label
     * @memberof CameraFeed
     * @instance
     */
    processDevices(devices) {
        devices.forEach(device => {
            console.log(device.label);
            this.setDevice(device);
        });
    }

    /**
     * Sets the active device and starts playing the feed
     * @memberof CameraFeed
     * @instance
     */
    async setDevice(device) {
        const { deviceId } = device;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
        this.videoPlayer.srcObject = stream;
        this.videoPlayer.play();
    }

}

export default withRouter(CameraFeed);
