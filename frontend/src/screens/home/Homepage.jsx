import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Box, Container, CircularProgress, Backdrop } from '@mui/material';
import { AccountCircle, School, Group, Login } from '@mui/icons-material';
// import { Popup } from '../../../components';
import classes from './Homepage.module.scss';

const Homepage = () => {
  const navigate = useNavigate();
  const currentUser  = useSelector(state => state.user.currentUser);
  const currentRole  = useSelector(state => state.user.currentUser?.admin?.role);
  const status  = useSelector(state => state.user.status);

  return (
    <div className={classes.homepage}>
      <h1>Homepage</h1>
      <div className={classes.homepage__container}>
        <div className={classes.homepage__container__box}>
          <div className={classes.homepage__container__box__login}>
            <div className={classes.homepage__container__box__icon}>
              <Login />
            </div>
            <div className={classes.homepage__container__box__text}>
              <Link to="/select-user">Login</Link>
            </div>
          </div>
          <div className={classes.homepage__container__box__icon}>
            <AccountCircle />
          </div>
          <div className={classes.homepage__container__box__text}>
            <h3>Admin</h3>
            <p>Register new admin</p>
            <Link to="/admin-register">Register</Link>
          </div>
        </div>
        <div className={classes.homepage__container__box}>
          <div className={classes.homepage__container__box__icon}>
            <School />
          </div>
          <div className={classes.homepage__container__box__text}>
            <h3>Student</h3>
            <p>Register new student</p>
            <Link to="/student-register">Register</Link>
          </div>
        </div>
        <div className={classes.homepage__container__box}>
          <div className={classes.homepage__container__box__icon}>
            <Group />
          </div>
          <div className={classes.homepage__container__box__text}>
            <h3>Group</h3>
            <p>Register new group</p>
            <Link to="/group-register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage;