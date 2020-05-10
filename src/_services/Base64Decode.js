/* There is an error with base64decoder code; String is not encoded correctly.
* In developent stage, user password is never retrieved from the database and
* we don't have to display user password to the user.
*/
export const Base64Decode = function(input) {

    console.log('input=', input);
    return '********';
  }
}
