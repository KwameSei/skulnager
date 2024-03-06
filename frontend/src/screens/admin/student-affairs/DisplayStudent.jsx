import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Tabs } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { BarCharts, CustomTabPanel, PieCharts } from '../../../components';
import { BlackButton, BlueButton, RedButton, PurpleButton, GreenButton } from '../../../components/ButtonStyled';
import { CustomTable } from '../../../components';
import { Delete, PostAdd, PersonAddAlt1Outlined, PersonRemoveAlt1Outlined } from '@mui/icons-material';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import { getRequest as request1, getSuccess } from '../../../state-management/userState/userSlice';
import { getRequest as request2, getSubjectsSuccess } from '../../../state-management/classState/classSlice';
import { overallAttendancePercentage, subjectAttendancePercentage, subjectGroupAttendance } from '../../../components/CalculateAttendance';

const DisplayStudent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showTab, setShowTab] = useState(false);
  const [value, setValue] = useState('1');
  const [open, setOpen] = useState({});
  const [selected, setSelected] = useState('table');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [sclassName, setSclassName] = useState('');
  const [school, setSchool] = useState('');
  const [subjectMarks, setSubjectMarks] = useState('');
  const [subjectsAttended, setSubjectsAttended] = useState([]);

  const { currentUser, userInfo, response, loading, error } = useSelector(state => state.user)
  console.log('User Info', userInfo);

  const URL = import.meta.env.VITE_SERVER_URL;

  const fields = password === "" 
    ? { name, rollNumber } : { name, rollNumber, password }

  // Fetch Student Details
  const fetchStudentDetails = async () => {
    dispatch(request1());

    try {
      const token = currentUser?.token || '';
      
      const res = await axios.get(`${URL}/api/student/get-student/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      console.log('This is the class details response', res);

      const studentData = res.data.student;
      console.log('Student Data', studentData)
      
      dispatch(getSuccess(studentData));
      
    } catch (error) {
      console.log('This is the class details error', error);
      toast.error(error.message);
    }
  };

  // Update Student Details
  const updateStudentDetails = async (id, fields) => {
    dispatch(request1());

    try {
      const token = currentUser?.token || '';
      
      const res = await axios.put(`${URL}/api/student/update-student/${id}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      console.log('This is the update response', res);

      const studentData = res.data.student;
      console.log('Student Data', studentData)
      
      dispatch(getSuccess(studentData));
      toast.success(res.data.message);
      
    } catch (error) {
      console.log('This is the update error', error);
      toast.error(error.message);
    }
  };

  // fetch subjects
  const fetchSubjects = async () => {
    dispatch(request2());

    try {
      const token = currentUser?.token || '';
      
      const res = await axios.get(`${URL}/api/subject/get-subjects`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      console.log('This is the subject response', res);

      const subjectData = res.data;
      console.log('Subject Data', subjectData)
      
      dispatch(getSubjectsSuccess(subjectData));
      
    } catch (error) {
      console.log('This is the subject error', error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    // Fetch student details only if id is available
    if (id) {
        fetchStudentDetails();
        updateStudentDetails(id, fields);
    }
  }, [dispatch, id]);

  useEffect(() => {
      // Fetch subjects only if userInfo and sclassName are available
      if (userInfo && userInfo.sclassName && userInfo.sclassName._id !== undefined) {
          fetchSubjects(userInfo.sclassName._id);
          console.log('This is the class id', userInfo.sclassName._id);
      }

      // Update subjects attended if userInfo is available and has attendance data
      if (userInfo && userInfo.attendance && userInfo.attendance.length > 0) {
          setSubjectsAttended(userInfo.attendance);
      }
  }, [userInfo, fetchSubjects]);

  const handleOpen = (subjectId) => {
    setOpen((prevState) => ({
      ...prevState,
      [subjectId]: !prevState[subjectId]
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleSectionChange = (event, newSection) => {
    setSelected(newSection);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Submit');

    updateStudentDetails(id, fields);
  }
    
  useEffect(() => {
      if (userInfo) {
        // Check if userInfo contains attendance data
      if (userInfo.attendance && Array.isArray(userInfo.attendance)) {
        // Assign attendance data to subjectsAttended
        setSubjectsAttended(userInfo.attendance);
      }

      setName(userInfo.name);
      setRollNumber(userInfo.rollNumber);
      setPassword(userInfo.password);
      setSclassName(userInfo.sclassName);
      setSchool(userInfo.school);
      setSubjectMarks(userInfo.subjectMarks);
      // setSubjectsAttended(userInfo.attendance);
    }
  }, [userInfo]);

  const totalAttendancePercentage = overallAttendancePercentage(subjectsAttended);
  const totalAbsentPercentage = 100 - totalAttendancePercentage;

  const chartData = [
    { name: "Present", value: totalAbsentPercentage },
    { name: "Absent", value: totalAbsentPercentage },
  ];

  const subjectInfo = Object.entries(subjectGroupAttendance(subjectsAttended))
    .map(([subjectName, { subjectCode, present, sessions }]) => {
      const attendancePercentage = subjectAttendancePercentage(present, sessions);

      return {
        subject: subjectName,
        attendancePercentage: attendancePercentage,
        totalClasses: sessions,
        classesAttended: present
      };
    });

  const StudentInfo = () => {
    return (
      <div>
        <h3>Student Details</h3>
        Name: {userInfo.name}
        <br />
        Number: {userInfo.rollNumber}
        <br />
        Class: {sclassName?.sclassName}
        <br />
        School: {school?.schoolName}

        {
          subjectsAttended && Array.isArray(subjectsAttended) && subjectsAttended.length > 0 && (
            <PieCharts data={chartData} />
          )
        }
        {/* <Button variant="contained" sx={styles.styledButton} onClick={deleteHandler}>
          Delete
        </Button> */}
      </div>
    )
  }

  const AttendanceTable = () => {
    const Table = () => {
      return (
        <>
          <h3>Student Attendance</h3>

          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Present</StyledTableCell>
                <StyledTableCell>Total Sessions</StyledTableCell>
                <StyledTableCell>Attendance Percentage</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            {Object.entries(subjectGroupAttendance(subjectsAttended))
              .map(([subjectName, { sessions, present, subjectId, allData }], index) => {
                const attendancePercentage = subjectAttendancePercentage(present, sessions);

                return (
                  <TableBody key={index}>
                    <StyledTableRow>
                      <StyledTableCell>{subName}</StyledTableCell>
                      <StyledTableCell>{present}</StyledTableCell>
                      <StyledTableCell>{sessions}</StyledTableCell>
                      <StyledTableCell>{attendancePercentage}%</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button variant="contained"
                          onClick={() => handleOpen(subId)}>
                          {open[subjectId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                        </Button>
                        {/* <IconButton onClick={() => removeSubAttendance(subjectId)}>
                          <DeleteIcon color="error" />
                        </IconButton> */}
                        <Button variant="contained"
                          onClick={() => navigate(`/admin-dashboard/subject/student/attendance/${id}/${subjectId}`)}>
                          Change
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open[subjectId]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                  Attendance Details
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <StyledTableRow>
                                      <StyledTableCell>Date</StyledTableCell>
                                      <StyledTableCell align="right">Status</StyledTableCell>
                                  </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                  {allData.map((data, index) => {
                                      const date = new Date(data.date);
                                      const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                      return (
                                          <StyledTableRow key={index}>
                                              <StyledTableCell component="th" scope="row">
                                                  {dateString}
                                              </StyledTableCell>
                                              <StyledTableCell align="right">{data.status}</StyledTableCell>
                                          </StyledTableRow>
                                      )
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                )
              })}
          </Table>
          <div>
              Overall Attendance Percentage: {subjectAttendancePercentage.toFixed(2)}%
          </div>
          {/* <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button> */}
          <Button variant="contained" onClick={() => navigate("/Admin/students/student/attendance/" + id)}>
              Add Attendance
          </Button>
        </>
      )
    }

    // Render Bar Chart
    const BarChart = () => {
      return (
        <div>
          <h3>Attendance</h3>
          <div>
            <BarCharts chartData={subjectInfo} dataKey="attendancePercentage" />
          </div>
        </div>
      )
    }

    return (
      <>
        {subjectsAttended && Array.isArray(subjectsAttended) && subjectsAttended.length > 0
          ?
          <>
            {selected === 'table' && AttendanceTable()}
            {selected === 'chart' && BarChart()}

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selected} onChange={handleSectionChange} showLabels>
                  <BottomNavigationAction
                      label="Table"
                      value="table"
                      icon={selected === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                  />
                  <BottomNavigationAction
                      label="Chart"
                      value="chart"
                      icon={selected === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                  />
              </BottomNavigation>
            </Paper>
          </>
          :
          <Button variant="contained" onClick={() => navigate("/Admin/students/student/attendance/" + id)}>
              Add Attendance
          </Button>
        }
      </>
    )
  }

  // Marks obtained
  const Marks = () => {
    const Table = () => {

      return (
        <>
          <h2>Marks obtained by student</h2>

          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Marks</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {subjectMarks && subjectMarks.map((mark, index) => {
                if (!mark.subjectName || !mark.marksObtained) {
                  return null;
                }

                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{mark.subjectName}</StyledTableCell>
                    <StyledTableCell>{mark.marksObtained}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
            Add Marks
          </Button>
        </>
      )
    }

    // Render Bar Chart
    const BarChart = () => {
      return (
        <div>
          <h3>Marks</h3>
          <div>
            <BarCharts chartData={subjectMarks} dataKey="marksObtained" />
          </div>
        </div>
      )
    }

    return (
      <>
        {subjectMarks && subjectMarks.length > 0
          ?
          <>
            {selected === 'table' && Table()}
            {selected === 'chart' && BarChart()}

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selected} onChange={handleSectionChange} showLabels>
                  <BottomNavigationAction
                      label="Table"
                      value="table"
                      icon={selected === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                  />
                  <BottomNavigationAction
                      label="Chart"
                      value="chart"
                      icon={selected === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                  />
              </BottomNavigation>
            </Paper>
          </>
          :
          <Button variant="contained" onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
              Add Marks
          </Button>
        }
      </>
    )
  }

  return (
    <>
      { loading ? <h1>Loading...</h1> 
        :
        <>
          <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', typography: 'body1' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Student Details" value="1" />
                <Tab label="Attendance" value="2" />
                <Tab label="Marks" value="3" />
              </Tabs>
            </Box>
            <div>
              <CustomTabPanel value={value} index='1'>
                <StudentInfo />
              </CustomTabPanel>
              <CustomTabPanel value={value} index='2'>
                <AttendanceTable />
              </CustomTabPanel>
              <CustomTabPanel value={value} index='3'>
                <Marks />
              </CustomTabPanel>
            </div>
          </Container>
        </>
      }
    </>
  )
}

export default DisplayStudent;