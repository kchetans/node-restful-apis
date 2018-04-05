const auth = require('express').Router();
import login from "./login";
var api = require('_includes').api;

/*********** MOBILE APIS ***********/
//obsolete
auth.get('/generate-otp', api.http(login.generateOtp));
//obsolete
auth.get('/login-with-otp', api.http(login.loginWithOtp));
//obsolete
auth.post('/sign-up', api.http(login.signUp));
//obsolete
auth.get('/sign_up_with_otp', api.http(login.signUpWithOtp));
//obsolete
auth.get('/forget-password-otp', api.http(login.forgetPasswordOtp));
auth.get('/actions', api.http(login.action));
/*********** WEB APIS ***********/

/** Generic Login, this is currently using **/
auth.get('/all-users', api.http(login.getAllUsers));
auth.post('/login', api.http(login.login));
auth.post('/register', api.http(login.register));

auth.get('/test-callback', api.http(login.testCallBack));
auth.get('/employee', api.http(login.getEmployee));


/**
 * You can also write in this way
 * but no middleware support will be provided
 */
auth.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default auth;
