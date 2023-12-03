// import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Checkbox, CircularProgress,CssBaseline, FormControlLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

import classes from './RegisterAdmin.module.scss';
import { registerUser } from '../../../state-management/userState/userHandle';
import { Popup } from '../../../components';
import { authSuccess } from '../../../state-management/userState/userSlice';

const RegisterAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);

  const { status, response, error } = useSelector(state => state.user);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentUser?.admin?.role);
  const token = useSelector(state => state.user.token);
  console.log('currentUser: ', currentUser);
  console.log('currentRole from Redux state:', currentRole);

  const URL = import.meta.env.VITE_SERVER_URL;
  const role = currentRole || 'Admin';

  // Create user registration form
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const schoolName = e.target.schoolName.value;
    const password = e.target.password.value;

    console.log('This is name: ', name);
    console.log('This is email: ', email);
    console.log('This is phone: ', phone);

    if (name === '' || name === null || name === undefined || name.length < 3 || name.length > 50) {
      setNameError(true);
      console.log('This is nameError: ', nameError);
    } else {
      setNameError(false);
      console.log('This is nameError: ', nameError);
    }

    if (email === '' || email === null || email === undefined || email.length < 6 || email.length > 30) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (phone === '' || phone === null || phone === undefined || phone.length < 10 || phone.length > 10) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }

    if (schoolName === '' || schoolName === null || schoolName === undefined || schoolName.length < 3 || schoolName.length > 50) {
      setSchoolNameError(true);
    } else {
      setSchoolNameError(false);
    }

    if (password === '' || password === null || password === undefined || password.length < 6 || password.length > 20) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // if (nameError === false && emailError === false && phoneError === false && schoolNameError === false && passwordError === false) {
    //   setLoader(true);
    //   dispatch({ type: 'USER_REGISTER_REQUEST', payload: { name, email, phone, schoolName, password, role } });
    // }

    const fields = { name, email, phone, schoolName, password, role: currentRole };
    setLoader(true);
    // dispatch(registerUser(fields, role));

    // console.log('Error in registration: ', error);
    // console.log('Response in registration: ', response);
    // console.log('Fields include: ', fields);

    try {
      const res = await axios.post(`${URL}/api/admin/register/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });
      console.log('Response after registration:', res);

      if (res.data) {
        dispatch(authSuccess(res.data));
        navigate('/admin-dashboard');
      } else {
        setMessage(res.data.message || 'Something went wrong');
        setShowPopup(true);
        setLoader(false);
      }
      
      // if (res && res.data) {
      //   if (res.data.schoolName) {
      //     dispatch(authSuccess(res.data));
      //     localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      //     localStorage.setItem('currentRole', JSON.stringify(res.data.role));
      //     localStorage.setItem('token', JSON.stringify(res.data.token));
      //     console.log('Redirecting to admin dashboard...');
      //     navigate('/admin-dashboard');
      //   } else if (res.data.school) {
      //     dispatch(StaffAdded());
      //     console.log('Redirecting to admin dashboard...');
      //     navigate('/admin-dashboard');
      //   } else {
      //     setMessage(res.data.message || 'Something went wrong');
      //     setShowPopup(true);
      //     setLoader(false);
      //   }
      // } else {
      //   // Log the response for debugging
      //   console.error('Unexpected response structure:', res);
      //   setMessage('Something went wrong');
      //   setShowPopup(true);
      //   setLoader(false);
      // }
    
      // if (res && res.data) {
      //   if (res.data.schoolName) {
      //     dispatch(authSuccess(res.data));
      //     localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      //     localStorage.setItem('currentRole', JSON.stringify(res.data.role));
      //     localStorage.setItem('token', JSON.stringify(res.data.token));
      //     navigate('/admin/dashboard');
      //     console.log('This is res.data: ', res.data);
      //   } else if (res.data.school) {
      //     dispatch(StaffAdded());
      //     navigate('/admin/dashboard');
      //     console.log('This is res.data: ', res.data);
      //   } else {
      //     setMessage(res.data.message || 'Something went wrong');
      //     setShowPopup(true);
      //     setLoader(false);
      //   }
      // } else {
      //   // Log the response for debugging
      //   console.error('Unexpected response structure:', res);
      //   setMessage('Something went wrong');
      //   setShowPopup(true);
      //   setLoader(false);
      // }
    } catch (err) {
      console.error('This is err:', err);
      setMessage(err.message || 'Something went wrong');
      setShowPopup(true);
      setLoader(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(e);
  };

  // useEffect(() => {
  //   if (status === 'success' || (currentUser !== null && currentRole === 'admin')) {
  //     navigate('/admin/dashboard');
  //   } else if (status === 'failed') {
  //     setMessage(response);
  //     setShowPopup(true);
  //     setLoader(false);
  //   } else if (error !== null) {
  //     setMessage(error);
  //     setShowPopup(true);
  //     setLoader(false);
  //     console.log(error);
  //   }
  // }, [status, currentUser, response, error, currentRole]);

  return (
    <div>
      <CssBaseline />
      <div className={classes.container}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            <h1>Register Admin</h1>
            <TextField
              error={nameError}
              helperText={nameError && 'Name must be between 3 and 50 characters'}
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoFocus
              autoComplete='name'
            />
            <TextField
              error={emailError}
              helperText={emailError && 'Email must be between 6 and 30 characters'}
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete='email'
            />
            <TextField
              error={phoneError}
              helperText={phoneError && 'Phone number must be 10 characters'}
              id="phone"
              name="phone"
              label="Phone Number"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete='phone'
            />
            <TextField
              error={schoolNameError}
              helperText={schoolNameError && 'School name must be between 3 and 50 characters'}
              id="schoolName"
              name="schoolName"
              label="School Name"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete='schoolName'
            />
            <TextField
              error={passwordError}
              helperText={passwordError && 'Password must be between 6 and 20 characters'}
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              type={toggle ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setToggle(!toggle)}>
                      {toggle ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {loader ? (
              <div className={classes.loader}>
                <CircularProgress color="inherit" />
              </div>
            ) : (
              <button type="submit" className={classes.btn}>
                Register
              </button>
            )}
            <Box className={classes.links}>
              <Link to="/login" className={classes.link}>
                Already have an account? Login
              </Link>
            </Box>
          </form>

          {showPopup && <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />}
        </div>
      </div>
    </div>
  )
}

export default RegisterAdmin;