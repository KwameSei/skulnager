import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../../state-management/userState/userSlice';

import classes from './RegisterAdmin.module.scss';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.user.currentUser);

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  }

  return (
    <div className={classes.logout}>
      <h2>Logout</h2>
      <p>Are you sure you want to logout {currentUser.name}?</p>
      <div className={classes.logout__buttons}>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default Logout;