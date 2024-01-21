import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Popup } from '../../../components';
import { underControl, StaffAdded, authFailure } from '../../../state-management/userState/userSlice';
import classes from './class-affairs.module.scss';

const CreateClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sclassName, setSclassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openPopUp, setOpenPopUp] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);
  const status = useSelector((state) => state.user.status);
  const response = useSelector((state) => state.user.response);
  const error = useSelector((state) => state.user.error);
  const tempUserInfo = useSelector((state) => state.user.tempUserInfo);

  const URL = import.meta.env.VITE_SERVER_URL;
  const token = useSelector((state) => state.user.currentUser.token);

  const AdminID = currentUser._id;
  const address = 'studentClass';

  const fields = {sclassName, AdminID};

  // Create a new class
  const createClass = async () => {
    try {
      const res = await axios.post(`${URL}/api/class/create-class`, fields, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });

      console.log('Create class response:', res)

      if (res.data.message) {
        console.log('Error creating class', res.data.message)
        dispatch(authFailure(res.data.message));
      } else {
        dispatch(StaffAdded(res.data));
      }
    } catch (err) {
      console.log('Error creating class', err.message);
      dispatch(authFailure(err.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createClass();
  };

  useEffect(() => {
    if (status === 'added' && tempUserInfo) {
      setMessage(response);
      setOpenPopUp(true);
      navigate('/classes/class/' + tempUserInfo._id);
      dispatch(underControl());
      setLoading(false);
    } else if (status === 'failed') {
      setMessage(response);
      setOpenPopUp(true);
      setLoading(false);
    } else if (status === 'error') {
      setMessage(error);
      setOpenPopUp(true);
      setLoading(false);
    }
  }, [ status, dispatch, navigate, error, response, tempUserInfo ]);

  return (
    <div className={classes.create_class}>
      <h1>Create a new class</h1>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Class Name"
            name="sclassName"
            onChange={(e) => setSclassName(e.target.value)}
            required
            value={sclassName}
            variant="outlined"
          />
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={loading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {loading ? <CircularProgress color="inherit" size={24} /> : 'Create Class'}
            </Button>
            <Button onClick={() => navigate(-1)} color="secondary" fullWidth size="large" variant="contained">
              Go Back
            </Button>
          </Box>
        </Stack>
      </form>
      <Popup
        openPopup={openPopUp}
        setOpenPopup={setOpenPopUp}
        title={message}
      />
    </div>
  )
}

export default CreateClass;