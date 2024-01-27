import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Grid, Box, Typography, CircularProgress, MenuItem, Select } from "@mui/material";
import { Popup } from '../../../components';
// import { addStuff } from '../../../state-management/userState/userHandle';
import { authError, authRequest, StaffAdded, underControl } from '../../../state-management/userState/userSlice';
import { getSuccess } from '../../../state-management/classState/classSlice';

const AddSubject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([{
    subjectName: '',
    subjectCode: '',
    sessions: '',
  }]);
  
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector(state => state.user.currentUser);
  const status = useSelector(state => state.user.status);
  const error = useSelector(state => state.user.error);
  const response = useSelector(state => state.user.response);
  const classList = useSelector(state => state.studentClass.classList);
  console.log('This is the class list', classList);

  const sclassName = params.id;
  const AdminID = currentUser?.admin._id || '';
  const user = useSelector(state => state.user);
  console.log('This is the admin id: ', AdminID);
  console.log('This is the user: ', user);

  const URL = import.meta.env.VITE_SERVER_URL;

  // Fetch all classes
  const fetchAllClasses = () => async (dispatch) => {
    dispatch(authRequest());

    try {
      const token = currentUser?.token || '';

      const res = await axios.get(`${URL}/api/class/get-all-classes`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });

      console.log('This is the class response', res);

      const classData = res.data;
      console.log('This is the class data', classData);

      dispatch(getSuccess(classData));
      toast.success('Classes fetched successfully');
    } catch (error) {
      toast.error(error.message);
      dispatch(authError({ error: error.message }));
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.admin) {
        dispatch(fetchAllClasses());
      }
    }
  }, [currentUser]);

  // Handle the change of the selected class
  const handleSelectedClass = (e) => {
    const newSelectedClass = e.target.value;
    setSelectedClass(newSelectedClass);

    // Update the sclassName property for each subject
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => ({ ...subject, sclassName: newSelectedClass }))
    );
  };

  
  const handleSubjectNameChange = (index) => (e) => {
    const newSubjects = subjects.map((subject, sIndex) => {
      if (index !== sIndex) return subject;
      return { ...subject, subjectName: e.target.value };
    });
    setSubjects(newSubjects);
  };

  const handleSubjectCodeChange = (index) => (e) => {
    const newSubjects = subjects.map((subject, sIndex) =>
      sIndex === index ? { ...subject, subjectCode: e.target.value } : subject
    );
    setSubjects(newSubjects);
  };

  const handleSessionsChange = (index) => (e) => {
    const newSubjects = subjects.map((subject, sIndex) =>
      sIndex === index ? { ...subject, sessions: e.target.value } : subject
    );
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: '', subjectCode: '', sessions: '' }]);
  };

  const handleRemoveSubject = (index) => () => {
    setSubjects(subjects.filter((s, sIndex) => index !== sIndex));
  };

  const handleCreateSubject = () => {
    console.log(subjects);
  }

  const handleCancel = () => {
    navigate('/admin/subject-affairs');
  }

  const handlePopupClose = () => {
    setShowPopup(false);
  }

  // Create subject
  const createSubject = () => async (dispatch) => {
    dispatch(authRequest());

    try {
      const fields = {
        sclassName: selectedClass,
        AdminID,
        subjects: subjects && subjects.map((subject) => ({
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          sessions: subject.sessions,
          sclassName: selectedClass
        })),
      };
    
      console.log('This is the fields', fields);
      
      const token = currentUser?.token || '';

      const res = await axios.post(`${URL}/api/subject/create-subject`, fields, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });

      console.log('This is the response', res);

      const subjectData = res.data.subject;
      console.log('This is the subject data', subjectData);

      dispatch(StaffAdded(subjectData));
      toast.success('Subject created successfully');
    } catch (error) {
      dispatch(authError({ error: error.message }));
      toast.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (subjects.subjectName === '' || subjects.subjectCode === '' || subjects.sessions === '') {
      toast.error('Please fill in all fields');
    } else {
      setLoading(true);
      dispatch(createSubject());
    }
  }

  useEffect(() => {
    if (status === 'added') {
      navigate('/admin/subject-affairs');
      dispatch(underControl());
      toast.success(response);
      setLoading(false);
    } else if (status === 'failed') {
      dispatch(underControl());
      toast.error(error);
      setLoading(false);
    } else if (error) {
      toast.error(error);
      dispatch(underControl());
      setLoading(false);
    }
  }, [status, error, response, dispatch, navigate]);

  return (
    <div>
      <Typography variant="h4" align="center" color="text.secondary" paragraph>
        Create Subject
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
        {subjects.map((subject, index) => (
          <>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id={`subjectName-${index}`}
              label="Subject Name"
              name="subjectName"
              autoComplete="subjectName"
              value={subject.subjectName}
              onChange={handleSubjectNameChange(index)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id={`subjectCode-${index}`}
              label="Subject Code"
              name="subjectCode"
              autoComplete="subjectCode"
              value={subject.subjectCode}
              onChange={handleSubjectCodeChange(index)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id={`sessions-${index}`}
              label="Sessions"
              name="sessions"
              autoComplete="sessions"
              value={subject.sessions}
              onChange={handleSessionsChange(index)}
            />
          </Grid>
          </>
          ))}
          <Grid item xs={12}>
            <Select
              required
              fullWidth
              label="Select Class"
              value={selectedClass}
              onChange={handleSelectedClass}
            >
              {Array.isArray(classList.allClasses) && classList.allClasses.map((classItem) => (
                <MenuItem key={classItem._id} value={classItem._id}>
                  {classItem.sclassName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Subject'}
            </Button>
          </Grid>
          {/* <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSelectedClass}
            >
              Add Class
            </Button>
          </Grid> */}
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Popup
        openPopup={showPopup}
        message={message}
        handleClose={handlePopupClose}
      />
    </div>
  )
}

export default AddSubject;