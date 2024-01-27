import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import Popup from '../../../components/Popup';
import { getSuccess, getFailureTwo, getError, getSubDetailsRequest, getSubjects } from '../../../state-management/classState/classSlice';
import { authSuccess, underControl } from '../../../state-management/userState/userSlice';

import classes from './teacher-affairs.module.scss';

const CreateTeacher = ({ situation }) => {
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
  // const subjectId = useSelector((state) => state.studentClass.subjectId);
  const subjects = useSelector((state) => state.studentClass.subjects);

  // Turn subjects into an array of objects
  const subjectList = subjects && Array.isArray(subjects.data) ? subjects.data : [];

  console.log('Subjects: ', subjects);
  // console.log('Subject ID:', subjectId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sclassName, setsclassName] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classing, setClassing] = useState([]);
  const [rollNumber, setRollNumber] = useState('');
  const [message, setMessage] = useState('');

  const AdminID = currentUser.admin._id;
  const school = currentUser.admin._id;
  const role = 'Teacher';
  const attendance = [];
  const marks = [];
  const assignments = [];
  const quizzes = [];
  const exams = [];
  const notifications = [];

  console.log('School: ', school)

  //Fetching all subjects
  const FetchSubjects = async (dispatch) => {

    try {
      const res = await axios.get(`${URL}/api/subject/get-subjects`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });

      console.log('Subjects response:', res);

      if (res.data) {
        dispatch(getSubjects(res.data));
        toast.success('Subject details fetched successfully');
      } else {
        dispatch(getFailureTwo(res.data.message));
        toast.error(res.data.message);
      }
    } catch (err) {
      dispatch(getError(err.message));
      toast.error(err.message);
    }
  };

  useEffect(() => {
      FetchSubjects(dispatch);
  }, [dispatch, token, currentUser]);

  // Fetching all classes
  const getAllClasses = async () => {
    try {
      const res = await axios.get(`${URL}/api/class/get-all-classes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });

      if (res.data && res.data.allClasses) {
        dispatch(getSuccess(res.data.allClasses));
      } else {
        dispatch(getFailureTwo(res.data.message));
        toast.error(res.data.message);
      }
    } catch (err) {
      dispatch(getError(err.message));
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllClasses(AdminID, URL, token);
  }, [AdminID, dispatch, URL, token]);

  useEffect(() => {
    console.log('Updated classList:', classList);
  }, [classList]);

  useEffect(() => {
    if (situation === 'Class') {
      setsclassName(id);
    }
  }, [ id, situation ]);

  // const changeHandler = (e) => {
  //   if (e.target.value === 'Choose class') {
  //     setsclassName('Choose class');
  //     setClassId('');
  //   } else {
  //     const selectedClass = classList.find((item) => item.sclassName === e.target.value);
  //     setsclassName(selectedClass.sclassName);
  //     setClassId(selectedClass._id);
  //     console.log('Selected sclassName:', selectedClass);
  //   };
  // }

  const changeHandler = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setsclassName([]);
      setClassId([]); // Make sure to reset classId when no options are selected
    } else {
      const selectedClassIds = selectedOptions.map((option) => option._id);
      setsclassName(selectedOptions.map((option) => option.sclassName));
      setClassId(selectedClassIds);
  
      console.log('Selected options:', selectedOptions);
      console.log('Selected class ids:', selectedClassIds);
    }
  };
  
  const handleSubjectChange = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setSubjectName([]);
      setSubjectId([]); // Make sure to reset subjectId when no options are selected
    } else {
      const selectedSubjectIds = selectedOptions.map((option) => option._id);
      setSubjectName(selectedOptions.map((option) => option.subjectName));
      setSubjectId(selectedSubjectIds);
  
      console.log('Selected options:', selectedOptions);
      console.log('Selected subject ids:', selectedSubjectIds);
    }
  };

  const fields = {
    name,
    email,
    password,
    subjectTaught: subjectId,
    classesTaught: classId,
    role,
    school: AdminID,
    attendance,
    marks,
    assignments,
    quizzes,
    exams,
    notifications,
    AdminID
  };

  // Registering a new student
  const registerTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/api/teacher/create-teacher/${role}`, fields, {
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
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '' || sclassName === '') {
      toast.error('Please fill in all fields');
    } else {
      setLoading(true);
      registerTeacher(e);
    }

    // if (sclassName === '') {
    //   setMessage('Please select a class');
    //   setOpenPopup(true);
    // } else {
    //   registerStudent(e);
    // }
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate(-1);
    } else if (status === 'failed') {
      toast.error(error);
      setLoading(false);
    } else if (status === 'error') {
      toast.error(error);
      setLoading(false);
    }
  }, [ status, dispatch, navigate, error ]);

  return (
    <div className='classes.create'>
      <form className='classes.create__form' onSubmit={handleSubmit}>
        <span className='classes.create__form__title'>Create Teacher</span>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='text'
              label="Name"
              placeholder="Enter teacher's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete='name'
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='email'
              label="Email"
              placeholder="Enter teacher's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Select
              isMulti
              options={classList}
              className='basic-multi-select'
              classNamePrefix='select'
              onChange={changeHandler}
              value={classList.filter((item) => sclassName.includes(item.sclassName))}
              getOptionLabel={(option) => option.sclassName}
              getOptionValue={(option) => option._id}
              isClearable
              placeholder="Choose class"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Select
              isMulti
              options={subjectList}
              className='basic-multi-select'
              classNamePrefix='select'
              onChange={handleSubjectChange}
              value={subjectList && subjectList.filter((item) => subjectName.includes(item.subjectName))}
              getOptionLabel={(option) => option.subjectName}
              getOptionValue={(option) => option._id}
              isClearable
              placeholder="Choose subject"
              required
            />
          </Grid>
            
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='password'
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='password'
              required
            />
          </Grid>

          <Grid item xs={12}>
            <div className='classes.create__form__button'>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress color='inherit' size='1.5rem' /> : 'Create Teacher'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default CreateTeacher;