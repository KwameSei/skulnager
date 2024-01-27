import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Container, Grid, Typography, Box, Paper } from '@mui/material';
import { getSuccess as StudentSuccess } from '../../../state-management/studentState/studentSlice';
import { getSuccess as ClassSuccess } from '../../../state-management/classState/classSlice';
import { getSuccess as TeacherSuccess } from '../../../state-management/teacherState/teacherSlice';
import Classroom from '../../../assets/images/classroom.jpg';
import Student from '../../../assets/images/student.jpg';
import Teacher from '../../../assets/images/teacher.jpg';
import Fees from '../../../assets/images/fees.jpg';
import CountUp from 'react-countup';
import styled from 'styled-components';

const AdminHomepage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const classList = useSelector(state => state.studentClass.classList);
  const students = useSelector(state => state.student.students);
  const teachers = useSelector(state => state.teacher.teachers);

  console.log("Teachers", teachers)
  console.log("Class list", classList)

  const adminId = currentUser?.admin?._id;
  const adminName = currentUser?.admin?.name;

  const URL = import.meta.env.VITE_SERVER_URL;

  const studentCount = students && students.length;
  const teacherCount = teachers && teachers.length;
  const classCount = classList && classList.length;

  // Fetch all students
  const fetchStudents = async (dispatch) => {
    try {
      const token = currentUser?.token;

      const res = await axios.get(`${URL}/api/student/get-all-students`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });

      console.log('Response after fetching students:', res);

      if (res.data.success) {
        const students = res.data.students;

        dispatch(StudentSuccess(students));
      }
    } catch (err) {
      console.log('Error while fetching students:', err);
    }
  };

  // Fetch all teachers
  const fetchTeachers = async (dispatch) => {
    try {
      const token = currentUser?.token;
    
      const res = await axios.get(`${URL}/api/teacher/get-teachers`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });
    
      console.log('Response after fetching teachers:', res);
    
      if (res.data && res.data.data) {
        console.log('Response data structure:', res.data.data);
        const teacherData = res.data.data; // Corrected property access
      
        dispatch(TeacherSuccess(teacherData));
      }
    } catch (err) {
      console.log('Error while fetching teachers:', err);
    }
  };

  // Fetch all classes
  const fetchClasses = async (dispatch) => {
    try {
      const token = currentUser?.token;

      const res = await axios.get(`${URL}/api/class/get-all-classes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        },
      });

      console.log('Response after fetching classes:', res);

      if (res.data.success) {
        const classes = res.data.allClasses;

        dispatch(ClassSuccess(classes));
      }
    } catch (err) {
      console.log('Error while fetching classes:', err);
    }
  };

  useEffect(() => {
    fetchStudents(dispatch);
    fetchTeachers(dispatch);
    fetchClasses(dispatch);
  }, []);
  
  return (
    <div>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" component="div" gutterBottom>
                Welcome, {adminName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Students
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    <CountUp end={studentCount} duration={3} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total number of students
                  </Typography>
                </Box>
                <img src={Student} alt="Student" width="70%" height="150" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Teachers
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    <CountUp end={teacherCount} duration={3} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total number of teachers
                  </Typography>
                </Box>
                <img src={Teacher} alt="Teacher" width="70%" height="150" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Classes
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    <CountUp end={classCount} duration={3} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total number of classes
                  </Typography>
                </Box>
                <img src={Classroom} alt="Classroom" width="70%" height="150" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Fees
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    <CountUp end={250374} duration={3} prefix='₵' />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total fees collected
                  </Typography>
                </Box>
                <img src={Fees} alt="Fees" width="70%" height="150" />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default AdminHomepage;