import axios from "axios";

/* Request Interceptor allows us to configure outgoing requests.
 * We can add Authorization Header to every requests. Here, we are
 * intercepting the request object sent from the Client and after
 * configuration the request object, we are returning the request
 * object back which is then sent to the Server.
 */
axios.interceptors.request.use(
   request => {
    console.log('request=', request);
    // ignore thes requests
    if (request.url !== '/authorize' &&
    request.url !== '/renew_access_token' &&
    request.url !== '/save_patient') {
      // for all other requests, add Authorization Header (access_token)
      const accessToken = JSON.parse(localStorage.getItem('loggedUser')).access_token;
      if (accessToken) {
        request.headers['Authorization'] = 'Bearer ' + accessToken;
      }
      request.headers['Content-Type'] = 'application/json';
      return request;
    }
    return request;   // return unmodified and original request
  },
  error => {
    console.log('error=', error);
    Promise.reject(error);
  });



/* Response Interceptor allows us to configure incoming responses from the Server
 * It allows us to send refresh_token back to the Server (for renewing access_token) if our
 * original request has failed due to expired access_token.
 * Here, we are intercepting the response object received from the Server and after
 * configuration of the response object, we are returning the response
 * object back which is then sent to the Client.
 */
axios.interceptors.response.use(
  response => response, error => {
    const originalRequest = error.config;       // error.config contains previous_request or original_request that failed beause of expired access_token
    console.log('originalRequest=', error.config);

    console.log('error.response=', error.response);    // {code: 401, status: 'UNAUTHORIZED', timestamp: 1587679114296, message: "Full authentication is required to access this resource"}

    // SERVER_DOWN error must be returned to user without resending second request
    if (error.response.status === 500) {
      return window.location.href = '/connectionError';
    }

    // do not resend 2nd request if 401 Unauthorized error is caused during user authentication
    if (error.response.status === 401 && originalRequest.url === '/authorize') {
      return Promise.reject(error);   // this error object is returned to Login.js If error.response.status = 'UNAUTHORIZED', display 'invalid credentials' message
    }

    // do not try to renew access token if 401 Unauthorized error is caused during registration of patient because registration does not require authentication
    if (error.response.status === 401 && originalRequest.url === '/save_patient') {
      return Promise.reject(error);   // this error object is returned to Login.js If error.response.status = 401, the cause is either username is duplicate but not expired token
    }

    // prevent infinite failed requests be sent to the Server to renew access_token when refresh_token is expired even thought it is caught in .catch(error=>{}) below
    if (error.response.status === 401 && originalRequest.url === '/renew_access_token') {
      // if error 401 is due to expired refresh_token, redirect to login page.
      localStorage.setItem('isRefreshTokenExpired', true);
      localStorage.removeItem('loggedUser');
      return window.location.href = '/login';
    }

    // execute this code if response.status is 401 and originalRequest has been rejected only once
    if (error.response.status === 401 && !originalRequest._retry) {   // i.e. originalRequest._retry !== undefined
      console.log('inside 401 and "original-request failed once"');
    //if (error.response.status === 401 && !originalRequest._retry) {
      // 401 error occured for the first time by the original request because of expired access_token.
      originalRequest._retry = true;    // this will ensure that the above condition will fail second time i.e. originalRequest is not sent to Server more than one time.
      const refreshToken = JSON.parse(localStorage.getItem('loggedUser')).refresh_token;
      return (
        axios.post('/renew_access_token', null, {
              headers: {
                  "Authorization" : "Bearer " + refreshToken
              }
        })
        /* this request will trigger interceptors.request.use() method which will then trigger
        * interceptors.response.use() again but on second time !originalRequest._retry condition fails
        * and this will prevent from submitting the failed original request over and over again.
        */
        .then(response => {
          if (response.status === 200) {    // if above request to renew access_token is successful
            console.warn('New jwtToken=', response.data);      // response.data = {access_token: 'new', refresh_token: 'old', userId: 'old', role: 'old'}
            localStorage.setItem('loggedUser', JSON.stringify(response.data));
            // Prepare Authorization Header for failed original request using re-newed access_token
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(localStorage.getItem('loggedUser')).access_token;
            // return the request object
            return axios(originalRequest);      // Request = {url: 'originalRequest', method: 'post', headers: {Authorization: '', Accept: '', Content-Type: ''}}
          }
        })
        .catch(error => {
          // if refresh_token is expired it will be caught above "error.response.status === 401 && originalRequest.url === '/renew_access_token'"
          if(error.response.status === 401) {
            window.location.href = '/login';    // could not use withRouter inside a function so use window.location.href (from javascript)
          }
          else {
            // must return Promise here or else you will get 'response.status = undefined' in .catch(error=>{}) error handler
            // of Component when expecting status 400 BAD_REQUEST for your original request while access_token is expired
            console.log('error.response=', error.response);
            return Promise.reject(error);
          }
        })
      );
    }

    console.log('error.response=', error.response);
    // default return - if above conditions are not met
    return Promise.reject(error);

});

















/*
* In order to use Interceptors with axios, define middleware (request and response methods) in 'Interceptors.js'
* Add "import './Interceptors.js';" to index.js
* Every outgoing request can be configured inside axios.interceptors.request.use()
* Every incoming response can be configured inside axios.interceptors.response.use()
* When user is making request to 'signin', 'signup', you don't want to add Bearer Token to the Authorization Header
* Only add Bearer Token to Authorization Header if that request needs authorization from the Server.
* Similarly, while most requests require access_token for authentication, refresh_token is sent in
* Authentication-Header while renewing access_token.
* Read more on - https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
*/


// ************ SCENARIO *************
// Request = '/admin_or_patient/get_appointments_by_patientid/sdf32'
// Expected Response => response.status = 400 (BAD_REQUEST)
// CONDITION: access_token has expired
// User sends request and gets '401 Unauthorized' response due to expired access_token,
// condition (error.response.status === 401 && !originalRequest._retry) is true and refresh_token is send
// in Authorization Header to renew access_token. (response.status === 200) condition is true and original requests
// is send again with new access_token. Now the expected response is 400 for original request. All conditions are checked inside
// axios.interceptors.response.use() and when none is matched, Promise.reject(error) is returned. But this error is not what is returned
// to the error handler .catch(error=>{}) in the Component. Instead Promise.reject(error) from the .catch(error=>{}) error handler
// inside the condition (error.response.status === 401 && !originalRequest._retry) is what is returned to the Component. If you do not
// return Promise.reject(error) from .catch(error=>{}) of condition (error.response.status === 401 && !originalRequest._retry) then
// you will get 'error.response === undefined' inside error handler of Component during above SCENARIO. If access_token is not expired
// then your code will work without returning the Promise.reject(error) from .catch(error=>{}) of condition
// (error.response.status === 401 && !originalRequest._retry)


/*
* Could not use withRouter inside function so used window.location.href (from javascript)
* When original request fails, it returns status of 401 (Unauthorized)
* This error prompts the browser to pop-up dialog box [Sign in http:/Localhost:3000 username: '', password: '']
* This error is caused by "WWW-Authenticate" header in the response send from the Server in AuthenticationEntryPoint.class
* Either remove the "WWW-Authenticate" header or return response.status of "200 Ok" or "403 Forbidden"
* First option is good, the second option goes againsts HTTP 1.1 Specification
*/
