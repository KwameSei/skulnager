import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Popup from '../../../components/Popup';
import { getSuccess, getFailureTwo, getError } from '../../../state-management/classState/classSlice';
import { authSuccess, underControl } from '../../../state-management/userState/userSlice';

import classes from './student-affairs.module.scss';

const CreateStudent = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUser = useSelector((state) => state.user.currentUser);
  const classList = useSelector((state) => state.studentClass.classList) || [];
  const studentClass = useSelector((state) => state.studentClass.studentClass);
  const status = useSelector((state) => state.user.status);
  const userRole = useSelector(state => state.user.currentUser?.admin?.role);
  const URL = import.meta.env.VITE_SERVER_URL;
  const token = useSelector((state) => state.user.currentUser.token);

  console.log('Redux classList:', classList);

  console.log('Student current user:', currentUser);

  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sclassName, setsclassName] = useState('');
  const [classId, setClassId] = useState('');
  const [classing, setClassing] = useState([]);
  const [rollNumber, setRollNumber] = useState('');
  const [message, setMessage] = useState('');

  const AdminID = currentUser._id;
  const school = currentUser.admin._id;
  const role = 'Student';
  const attendance = [];
  const marks = [];
  const assignments = [];
  const quizzes = [];
  const exams = [];
  const subjects = [];
  const notifications = [];

  console.log('School: ', school)

  // Fetching all classes
  const getAllClasses = async () => {
    try {
      const res = await axios.get(`${URL}/api/class/get-all-classes`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });

      console.log('Fetched classes response:', res)

      // if (res.data.message) {
      //   console.log('Error fetching classes', res.data.message)
      //   dispatch(getFailureTwo(res.data.message));
      // } else {
      //   console.log('Data fetched and dispatched', res.data)
      //   // dispatch(getSuccess(res.data.allClasses));
      //   dispatch(getSuccess(res.data.allClasses));
      //   console.log('Dispatched action payload:', res.data.allClasses);
      //   setClassing(res.data.allClasses);
      // }

      if (res.data && res.data.allClasses) {
        console.log('Data fetched and dispatched', res.data)
        // dispatch(getSuccess(res.data.allClasses));
        dispatch(getSuccess(res.data.allClasses));
        console.log('Dispatched action payload:', res.data.allClasses);
        setClassing(res.data.allClasses);
      } else {
        console.log('Error fetching classes', res.data.message)
        dispatch(getFailureTwo(res.data.message));
      }
    } catch (err) {
      dispatch(getError(err.message));
    }
  };

  useEffect(() => { // Fetching all classes
    getAllClasses(AdminID, studentClass, URL, token);
  }, [ AdminID, studentClass, dispatch, URL, token ]);

  useEffect(() => {
    console.log('Updated classList:', classList);
  }, [classList]);

  useEffect(() => {
    if (situation === 'Class') {
      setsclassName(id);
    }
  }, [ id, situation ]);

  const changeHandler = (e) => {
    if (e.target.value === 'Choose class') {
      setsclassName('Choose class');
      setClassId('');
    } else {
      const selectedClass = classList.find((item) => item.sclassName === e.target.value);
      setsclassName(selectedClass.sclassName);
      setClassId(selectedClass._id);
      console.log('Selected sclassName:', selectedClass);
    };
  }

  const fields = {
    name,
    // email,
    password,
    sclassName,
    rollNumber,
    role,
    school,
    attendance,
    marks,
    assignments,
    quizzes,
    exams,
    subjects,
    notifications,
    AdminID: currentUser.admin._id,
  };

  // Registering a new student
  const registerStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/api/student/create-student/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });
      console.log('req.headers:', req.headers);
      console.log('Response after registration:', res);

      if (res.data.message) {
        setError(res.data.message);
        setLoading(false);
      } else {
        setLoading(false);
        setOpenPopup(true);
        dispatch(authSuccess(res.data));
        setName('');
        // setEmail('');
        setPassword('');
        setsclassName('');
        setRollNumber('');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (sclassName === '') {
      setMessage('Please select a class');
      setOpenPopup(true);
    } else {
      registerStudent(e);
    }
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate(-1);
    } else if (status === 'failed') {
      setMessage('Failed to add student');
      setOpenPopup(true);
      setLoading(false);
    } else if (status === 'error') {
      setMessage('Error adding student');
      setOpenPopup(true);
      setLoading(false);
    }
  }, [ status, dispatch, navigate, error ]);

  return (
    <div className='classes.create'>
      <form className='classes.create__form' onSubmit={handleSubmit}>
        <span className='classes.create__form__title'>Create Student</span>
        <div className='classes.create__form__input'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete='name'
            required
          />
        </div>
        {
          situation === 'Student' ? (
            <div className='classes.create__form__input'>
              <label htmlFor='class'>Class</label>
              <select
                // name='class'
                // id='class'
                value={sclassName || 'Choose class'}
                onChange={changeHandler}
                required
              >
                <option value='Choose class'>Choose class</option>
                {console.log('Class List:', classList)}
                {classList && classList.length > 0 && (
                  <>
                    <option value='Choose class'>Choose class</option>
                    {console.log('classList mapping', classList)}
                    {classList && classList.map((item, index) => (
                      <option key={index} value={item.sclassName}>{item.sclassName}</option>
                    ))}
                  </>
                )}

              </select>
            </div>
          ) : (
            <div className='classes.create__form__input'>
              <label htmlFor='class'>Class</label>
              <select
                name='class'
                id='class'
                value={sclassName}
                onChange={changeHandler}
                required
              >
                <option value='Choose class'>Choose class</option>
                {classList && classList.length > 0 && (
                  <>
                    <option value='Choose class'>Choose class</option>
                    {console.log('classList mapping', classList)}
                    {classList && classList.map((item, index) => (
                      <option key={index} value={item.sclassName}>{item.sclassName}</option>
                    ))}
                  </>
                )}

              </select>
            </div>
          )
        }
        <div className='classes.create__form__input'>
          <label htmlFor='rollNumber'>Roll Number</label>
          <input
            type='text'
            name='rollNumber'
            id='rollNumber'
            placeholder='Enter roll number'
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            autoComplete='rollNumber'
            required
          />
        </div>
        {/* <div className='classes.create__form__input'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            id='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
            required
          />
        </div> */}
        <div className='classes.create__form__input'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            id='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='password'
            required
          />
        </div>
        <div className='classes.create__form__button'>
          <button type='submit' disabled={loading}>
            {loading ? <CircularProgress color='inherit' size='1.5rem' /> : 'Create'}
          </button>
        </div>
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title={error ? 'Error' : 'Success'}
          message={error || message}
          situation={error ? 'error' : 'success'}
        />
      </form>
    </div>
  )
}

export default CreateStudent;