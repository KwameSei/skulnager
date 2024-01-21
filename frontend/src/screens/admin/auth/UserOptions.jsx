import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Grid, Paper, Box, Container, CircularProgress, Backdrop } from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import { Popup } from '../../../components';
import { authSuccess } from '../../../state-management/userState/userSlice';
import classes from './RegisterAdmin.module.scss';

const UserOptions = ({ visitor }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMsg, setPopupMsg] = useState('');
  const [popupType, setPopupType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');
  const password = '123';

  const currentUser = useSelector(state => state.user.currentUser);
  // const currentRole = useSelector(state => state.user.currentUser?.admin?.role);
  let currentRole = null;

  if (currentUser) {
    if (currentUser.admin) {
      currentRole = currentUser.admin.role;
    } else if (currentUser.student) {
      currentRole = currentUser.student.role;
    } else if (currentUser.teacher) {
      currentRole = currentUser.teacher.role;
    } else if (currentUser.user) {
      currentRole = currentUser.user.role;
    }
  }

  const status = useSelector(state => state.user.status);

  const URL = import.meta.env.VITE_SERVER_URL;
  const role = currentRole || 'Admin';

  // const Select = async (e, currentRole) => {
  //   e.preventDefault();

  //   const email = e.target.email.value;
  //   const password = e.target.password.value;

  //   const fields = { email, password, role: currentRole}
  //   setLoading(true);

  //   try {
  //     const res = await axios.post(`${URL}/api/admin/login/${role}`, fields, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
  //       },
  //     });
  //     console.log('Response after registration:', res);

  //     if (currentRole === 'Admin') {
  //       if (visitor === 'guest') {
  //         const email = 'kwamesei@gmail.com';
  //         const fields = { email, password };
  //         dispatch(authSuccess(fields, currentRole));
  //       } else {
  //         navigate('/admin-dashboard');
  //       }
  //     } else if (currentRole === 'Student') {
  //       if (visitor === 'guest') {
  //         const rollNumber = '1';
  //         studentName = 'Kwame Sei';
  //         const fields = { rollNumber, password, studentName };
  //         dispatch(authSuccess(fields, currentRole));
  //       } else {
  //         navigate('/student-dashboard');
  //       }
  //     } else if (currentRole === 'Teacher') {
  //       if (visitor === 'guest') {
  //         const teacherId = '1';
  //         const email = 'teacher@gmail.com';
  //         const fields = { teacherId, password, email };
  //         dispatch(authSuccess(fields, currentRole));
  //       } else {
  //         navigate('/teacher-dashboard');
  //       }
  //     } else if (currentRole === 'User') {
  //       if (visitor === 'guest') {
  //         const userId = '1';
  //         const fields = { userId, password };
  //         dispatch(authSuccess(fields, currentRole));
  //       } else {
  //         navigate('/user-dashboard');
  //       }
  //     }
  //   } catch (err) {
  //     console.log('Error after registration:', err);
  //     setError(err.response.data.message);
  //     setOpenPopup(true);
  //   }
  // }

  const userSelect = (user, e) => {
    e.preventDefault();

    if (user === 'Admin') {
      if (visitor === 'guest') {
        const email = 'kwamesei@gmail.com';
        const fields = { email, password };
        setLoading(true);
        dispatch(authSuccess(fields, user));
      } else {
        navigate('/admin-dashboard');
      }
    } else if (user === 'Student') {
      if (visitor === 'guest') {
        const rollNumber = '1';
        studentName = 'Kwame Sei';
        const fields = { rollNumber, password, studentName };
        setLoading(true);
        dispatch(authSuccess(fields, user));
      } else {
        navigate('/student-dashboard');
      }
    } else if (user === 'Teacher') {
      if (visitor === 'guest') {
        const teacherId = '1';
        const email = 'teacher@gmail.com';
        const fields = { teacherId, password, email };
        setLoading(true);
        dispatch(authSuccess(fields, user));
      } else {
        navigate('/teacher-dashboard');
      }
    } else if (user === 'User') {
      if (visitor === 'guest') {
        const userId = '1';
        const fields = { userId, password };
        setLoading(true);
        dispatch(authSuccess(fields, user));
      } else {
        navigate('/user-dashboard');
      }
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/admin-dashboard');
      } else if (currentRole === 'Student') {
        navigate('/student-dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/teacher-dashboard');
      } else if (currentRole === 'User') {
        navigate('/user-dashboard');
      }
    } else if (status === 'failed') {
      setLoading(false);
      setError('Invalid email or password');
      setOpenPopup(true);
    }
  }, [status, currentUser, currentRole, navigate]);
  
  const handlePopupClose = () => {
    setOpenPopup(false);
  }

  const handlePopupOpen = () => {
    setOpenPopup(true);
  }

  const handlePopup = (title, msg, type) => {
    setPopupTitle(title);
    setPopupMsg(msg);
    setPopupType(type);
    handlePopupOpen();
  }

  return (
    <div className={classes.choice}>
      <Container maxWidth="sm">
        <Paper elevation={3} className={classes.choice__paper}>
          <Box className={classes.choice__box}>
            <h2 className={classes.choice__heading}>Choose a role</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Link className={classes.choice__item} to='/admin-login'>
                  <AccountCircle className={classes.choice__icon} />
                  <h3 className={classes.choice__title}>Admin</h3>
                  <h5>Login as administrator to manage all the administrative processes of the school</h5>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link className={classes.choice__item} to='/student-login' >
                  <School className={classes.choice__icon} />
                  <h3 className={classes.choice__title}>Student</h3>
                  <h5>Login as a student to see your class activities</h5>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link className={classes.choice__item} to='/teacher-login'>
                  <Group className={classes.choice__icon} />
                  <h3 className={classes.choice__title}>Teacher</h3>
                  <h5>Login as a teacher to manage your class activities</h5>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.choice__item} onClick={(e) => userSelect('User', e)}>
                  <AccountCircle className={classes.choice__icon} />
                  <h3 className={classes.choice__title}>User</h3>
                  <h5>Login as a user to manage your account</h5>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Popup
        title={popupTitle}
        msg={popupMsg}
        type={popupType}
        openPopup={openPopup}
        handleClose={handlePopupClose}
      />
      {/* {userType === 'Admin' &&
        <form onSubmit={(e) => Select(e, 'Admin')}>
          <input type="hidden" name="email" value="" />
          <input type="hidden" name="password" value={password} />
          <input type="submit" value="Submit" />
        </form>
      } */}
    </div>
  )
}

export default UserOptions;