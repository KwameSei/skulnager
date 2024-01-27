import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getError, getRequest, getSuccess } from '../../../state-management/userState/userSlice';

const URL = import.meta.env.VITE_SERVER_URL;

const StudentAttendance = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.user.currentUser);

  const getStudentDetails = () => async (dispatch) => {
    dispatch(getRequest());

    try {
      const token = currentUser?.token || '';

      const res = await axios.get(`${URL}/api/student/get-student/${id}`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });

      console.log('This is the response', res);

      const studentData = res.data.student;
      console.log('This is the student data', studentData);

      dispatch(getSuccess(studentData));
    } catch (error) {
      dispatch(getError({ error: error.message }));
    }
  }

  useEffect(() => {
    if (currentUser) {
      if (currentUser.admin) {
        dispatch(getStudentDetails());
      }
    }
  }, [currentUser]);
  
  return (
    <div>StudentAttendance</div>
  )
}

export default StudentAttendance;