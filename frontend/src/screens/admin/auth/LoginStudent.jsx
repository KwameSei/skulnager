import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Popup } from '../../../components';
// import { localStorage } from 'localStorage';

import { authSuccess, updateUserRole } from '../../../state-management/userState/userSlice';

import classes from './RegisterAdmin.module.scss';

const theme = createTheme();

const LoginStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMsg, setPopupMsg] = useState('');
  const [popupType, setPopupType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentRole);
  const status = useSelector(state => state.user.status);
  const token = useSelector(state => state.user.token);
  const role = 'Student';
  const user = useSelector(state => state.user);

  // let currentRole = null;

  // // Defining possible roles
  // const possibleRoles = ['Admin', 'Student', 'Teacher', 'User'];

  // // Iterate through possible roles and check if currentRole is one of them
  // // If it is, set the currentRole to that role
  // for (let i = 0; i < possibleRoles.length; i++) {
  //   if (currentUser?.[possibleRoles[i]]?.role) {
  //     currentRole = possibleRoles[i];
  //     break;
  //   }
  // }

  // console.log('Dynamically determined currentRole:', currentRole);

  console.log('currentUser in login:', currentUser);
  console.log('currentRole in login:', currentRole);
  console.log('status in login:', status);
  console.log('token in login:', token);
  console.log('This is the user info: ', user);

  const URL = import.meta.env.VITE_SERVER_URL;
  // role = currentRole || 'Admin';

  const loginHandle = async (e) => {
    e.preventDefault();
    console.log('Login handle triggered');
  
    const passwordField = e.target.password;
    const password = passwordField ? passwordField.value : '';
  
    const rollNumberField = e.target.rollNumber;
    const rollNumber = rollNumberField ? rollNumberField.value : '';
  
    const studentNameField = e.target.name;
    const name = studentNameField ? studentNameField.value : '';
  
    const userIdField = e.target.userId;
    const userId = userIdField ? userIdField.value : '';
  
    const fields = { role, rollNumber, name, password, userId };
  
    setLoading(true);
  
    try {
      const res = await axios.post(`${URL}/api/student/login-student/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });
  
      console.log('Response after login:', res);
  
      if (res.data.success) {
        // Extract the token from the response
        const token = res.data.token;
      
        // Extract the role from the response
        const userRole = res.data.student?.role || 'Student';
      
        // Store the token and role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('currentRole', userRole);
      
        // Handle different roles here
        const userData = res.data;
      
        dispatch(authSuccess(userData, userRole));
        dispatch(updateUserRole(userRole));
        console.log('Successfully logged in:', userData)
      
        navigate('/student-dashboard');
      }      
    } catch (error) {
      console.error('Error during login:', error);
      // Handle errors here
    } finally {
      setLoading(false);
    }
  };   

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    loginHandle(e);
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'email') {
      setEmailError(false);
    } else if (e.target.name === 'password') {
      setPasswordError(false);
    } else if (e.target.name === 'rollNumber') {
      setRollNumberError(false);
    } else if (e.target.name === 'name') {
      setStudentNameError(false);
    }
  }

  // Guest login
  const guestLogin = async () => {
    setGuestLoader(true);
    const password = '123';

    const fields = { email, password, role: currentRole}

    try {
      const res = await axios.post(`${URL}/api/student/login-student/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });
      console.log('Response after login:', res);

      setGuestLoader(true);

    if (role === 'Student') {
      const rollNumber = '1';
      const name = 'Kwame Sei';
      const fields = { rollNumber, password, name };
      dispatch(authSuccess(fields, role));
      console.log("Student login", authSuccess(fields, role))

      // if (role === 'Admin') {
      //   const email = 'admin@gmail.com';
      //   const fields = { email, password };
      //   dispatch(authSuccess(fields, role));
      // } else if (role === 'Student') {
      //   const rollNumber = '1';
      //   const name = 'Kwame Sei';
      //   const fields = { rollNumber, password, name };
      //   dispatch(authSuccess(fields, role));
      //   console.log("Student login", authSuccess(fields, role))
      // } else if (role === 'Teacher') {
      //   const teacherId = '1';
      //   const email = 'teacher@gmail.com';
      //   const fields = { teacherId, password, email };
      //   dispatch(authSuccess(fields, role));
      }
    } catch (error) {
      console.log('Error after login:', error);
      setError(error.response.data.message);
      setOpenPopup(true);
    }
  }

  // useEffect(() => {
  //   console.log('useEffect triggered:', status, currentRole);
  
  //   // Log user state and token
  //   console.log('User State:', currentUser);
  //   console.log('Token:', token);
  
  //   const redirectToDashboard = () => {
  //     if (currentRole === 'Admin') {
  //       navigate('/admin-dashboard');
  //     } else if (currentRole === 'Student') {
  //       navigate('/student-dashboard');
  //     } else if (currentRole === 'Teacher') {
  //       navigate('/teacher-dashboard');
  //     } else if (currentRole === 'User') {
  //       navigate('/user-dashboard');
  //     }
  //   };
  
  //   if (status === 'idle') {
  //     // Further code (if needed) when status is 'idle'
  //   } else if (status === 'success') {
  //     // Check if currentUser and currentRole are updated before redirection
  //     if (currentUser && currentRole) {
  //       redirectToDashboard();
  //     }
  //   } else if (status === 'failed') {
  //     // Handle the failed state
  //     console.log('Failed:', error);
  //     setPopupMsg('Login failed. Please check your credentials.');
  //     setOpenPopup(true);
  //     setLoading(false);
  //   } else if (status === 'error') {
  //     // Handle the error state
  //     console.log('Error:', error);
  //     setPopupMsg('An unexpected error occurred. Please try again.');
  //     setOpenPopup(true);
  //     setLoading(false);
  //     setGuestLoader(false);
  //   }
  // }, [status, currentUser, currentRole, token, navigate, error]);  

  const handlePopupClose = () => {
    setOpenPopup(false);
    setError('');
  }

  return (
    <div className={classes.login}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={5} className={classes.image} />
        <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square className={classes.formContainer}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <ThemeProvider theme={theme}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={toggle ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  error={passwordError}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setToggle(!toggle)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {toggle ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="rollNumber"
                  label="Roll Number"
                  id="rollNumber"
                  autoComplete="rollNumber"
                  error={rollNumberError}
                  onChange={handleInputChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="Student Name"
                  id="name"
                  autoComplete="name"
                  error={studentNameError}
                  onChange={handleInputChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress color="inherit" size={20} /> : 'Login'}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link to="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs>
                    <Link to="#" variant="body2" onClick={guestLogin}>
                      Guest login
                    </Link>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs>
                    <Link to="/admin-login" variant="body2">
                      Have an account? Sign In
                    </Link>
                  </Grid>
                </Grid>
              </ThemeProvider>
            </form>

            <Popup
              title={popupTitle}
              msg={popupMsg}
              type={popupType}
              openPopup={openPopup}
              handleClose={handlePopupClose}
            />

            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginStudent;