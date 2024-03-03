import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Container, Typography, Tab, IconButton, Tabs } from '@mui/material';
import { CustomTabPanel } from '../../../components';
// import TabContext from '@mui/lab/TabContext';
// import TabPanel from '@mui/lab/TabPanel';
// import TabList from '@mui/lab/TabList';
import { BlackButton, BlueButton, RedButton, PurpleButton, GreenButton } from '../../../components/ButtonStyled';
import { CustomTable } from '../../../components';
import { Delete, PostAdd, PersonAddAlt1Outlined, PersonRemoveAlt1Outlined } from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { getRequest, detailsSuccess, getSubjectsSuccess, getStudentsSuccess } from '../../../state-management/classState/classSlice';

const DisplayClass = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log('ID', id);

  const [value, setValue] = useState('1');

  const currentUser = useSelector((state) => state.user);
  const { subjects, classStudents, loading, error, response, getresponse } = useSelector((state) => state.studentClass);
  const classDetails = useSelector(state => state.studentClass.classDetails)
  console.log('This are the class subjects', subjects);
  console.log('Class Details', classDetails)
  
  console.log('Extracted id:', id);
  const URL = import.meta.env.VITE_SERVER_URL;

  // Fetch details of class
  const fetchClassDetails = async () => {
    dispatch(getRequest());

    try {
      const token = currentUser?.token || '';
      
      const res = await axios.get(`${URL}/api/class/get-class/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      console.log('This is the class details response', res);

      const classData = res.data.foundClass;
      console.log('Class Data', classData)
      
      dispatch(detailsSuccess(classData));
      
    } catch (error) {
      console.log('This is the class details error', error);
      toast.error(error.message);
    }
  };

  // Fetch student in a class
  const fetchClassStudent = async () => {
    dispatch(getRequest());

    try {
      const token = currentUser?.token || '';
      
      const res = await axios.get(`${URL}/api/class/get-students-from-class/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      console.log('This is the class students response', res);

      const classInStudent = res.data.studentsInClass;
      
      dispatch(getStudentsSuccess(classInStudent));
    } catch (error) {
      console.log('This is the class students error', error);
      toast.error(error.message);
    }
  };

  // Fetch subjects in a class
  const fetchClassSubjects = async () => {
    dispatch(getRequest());

    try {
      const token = currentUser?.token || '';
      
      const res = await axios.get(`${URL}/api/class/get-subjects-from-class/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      console.log('This is the class subjects response', res);

      const SubjectsInClass = res.data.subjects;
      
      dispatch(getSubjectsSuccess(SubjectsInClass));
    } catch (error) {
      console.log('This is the class subjects error', error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchClassDetails();
    fetchClassStudent();
    fetchClassSubjects();
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddStudent = () => {
    navigate(`/create-student/${id}`);
  }

  const handleAddSubject = () => {
    navigate(`/add-subject/${id}`);
  }

  const handleDeleteStudent = () => {
    navigate(`/delete-student/${id}`);
  }

  const handleDeleteSubject = () => {
    navigate(`/delete-subject/${id}`);
  }

  const handleDeleteClass = () => {
    navigate(`/delete-class/${id}`);
  }

  const handleEditClass = () => {
    navigate(`/edit-class/${id}`);
  }

  const handleStudentAttendance = () => {
    navigate(`/student-attendance/${id}`);
  }

  const subjectColumns = [
    { id: 'subjectName', label: 'Subject Name', minWidth: 170 },
    { id: 'subjectCode', label: 'Subject Code', minWidth: 100},
    { id: 'sclassName', label: 'Class', minWidth: 100 },
    { id: 'edit', label: 'Edit', minWidth: 100 },
    { id: 'delete', label: 'Delete', minWidth: 100 },
  ];

  const subjectRows = subjects && subjects.length > 0 && subjects.map((subject) => {
    return {
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      sclassName: subject.sclassName,
      edit: <IconButton><Delete /></IconButton>,
      delete: <IconButton><Delete /></IconButton>,
    };
  })

  const subjectButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => handleDeleteSubject}>
          <Delete color='error' />
        </IconButton>
        <GreenButton
          variant='contained'
          onClick={() => {
            navigate(`/subject/${id}/${row.id}`)
          }}
        >
          View
        </GreenButton>
      </>
    )
  };

  const subjectActions = [
    { icon: <Delete color='error' />, name: 'Delete', action: () => handleDeleteSubject() },
    { icon: <PostAdd color='success' />, name: 'Add', action: () => handleAddSubject() },
  ];

  const ClassSubjectsSection = () => {
    return (
      <div>
        {
          subjects && subjects.length > 0 ? (
            <>
              <Typography variant='h5' color='textSecondary'>
                Subjects
              </Typography>

              <CustomTable
                columns={subjectColumns}
                rows={subjectRows}
                buttonHaver={subjectButtonHaver}
                actions={subjectActions}
              />
            </>
          ) : (
            <Typography variant='h5' color='textSecondary'>
              No subjects yet
            </Typography>
          )
        }
      </div>
    )
  };

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNumber', label: 'Student Number', minWidth: 100 },
    { id: 'sclassName', label: 'Class', minWidth: 100 },
    { id: 'edit', label: 'Edit', minWidth: 100 },
    { id: 'delete', label: 'Delete', minWidth: 100 },
  ];

  const studentRows = classStudents && classStudents.length > 0 && classStudents.map((student) => {
    return {
      name: student.name,
      rollNumber: student.rollNumber,
      sclassName: student.sclassName,
      edit: <IconButton><Delete /></IconButton>,
      delete: <IconButton><Delete /></IconButton>,
    };
  })

  const studentButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => handleDeleteStudent}>
          <Delete color='error' />
        </IconButton>
        <GreenButton
          variant='contained'
          onClick={() => {
            navigate(`/student/${id}/${row.id}`)
          }}
        >
          View
        </GreenButton>
        <BlueButton
          variant='contained'
          onClick={() => {
            navigate(`/student-attendance/${id}/${row.id}`)
          }}
        >
          Attendance
        </BlueButton>
      </>
    )
  }

  const studentActions = [
    { icon: <Delete color='error' />, name: 'Delete', action: () => handleDeleteStudent() },
    { icon: <PostAdd color='success' />, name: 'Add', action: () => handleAddStudent() },
  ];

  const ClassStudentsSection = () => {
    return (
      <div>
        {
          classStudents && classStudents.length > 0 ? (
            <>
              <Typography variant='h5' color='textSecondary'>
                Students
              </Typography>

              <CustomTable
                columns={studentColumns}
                rows={studentRows}
                buttonHaver={studentButtonHaver}
                actions={studentActions}
              />
            </>
          ) : (
            <Typography variant='h5' color='textSecondary'>
              No students yet
            </Typography>
          )
        }
      </div>
    )
  }

  const ClassDetailsSection = () => {
    const numberOfStudents = classStudents && classStudents.length;
    const numberOfSubjects = subjects && subjects.length;
    const classTeacher = classDetails && classDetails.teacher;
    const classCode = classDetails && classDetails.classCode;
    const className = classDetails && classDetails.sclassName;
    const id = classDetails && classDetails._id;

    return (
      <div>
        <Typography variant='h5' color='textSecondary'>
          Class Details
        </Typography>

        <Typography variant='body1' color='textSecondary'>
          Class Name: {className}
        </Typography>

        <Typography variant='body1' color='textSecondary'>
          Class Code: {classCode}
        </Typography>

        <Typography variant='body1' color='textSecondary'>
          Class Teacher: {classTeacher}
        </Typography>

        <Typography variant='body1' color='textSecondary'>
          Number of Students: {numberOfStudents}
        </Typography>

        <Typography variant='body1' color='textSecondary'>
          Number of Subjects: {numberOfSubjects}
        </Typography>
      </div>
    )
  }

  const ClassActionsSection = () => {
    return (
      <div>
        <Typography variant='h5' color='textSecondary'>
          Actions
        </Typography>

        <GreenButton
          variant='contained'
          onClick={() => {
            navigate(`/edit-class/${id}`)
          }}
        >
          Edit Class
        </GreenButton>

        <RedButton
          variant='contained'
          onClick={() => {
            navigate(`/delete-class/${id}`)
          }}
        >
          Delete Class
        </RedButton>
      </div>
    )
  }

  const ClassAttendanceSection = () => {
    return (
      <div>
        <Typography variant='h5' color='textSecondary'>
          Attendance
        </Typography>

        <GreenButton
          variant='contained'
          onClick={() => {
            navigate(`/student-attendance/${id}`)
          }}
        >
          Student Attendance
        </GreenButton>
      </div>
    )
  }
  
  return (
    <div>
      <Container>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Class Details" value="1" />
            <Tab label="Students" value="2" />
            <Tab label="Subjects" value="3" />
            <Tab label="Actions" value="4" />
            <Tab label="Attendance" value="5" />
          </Tabs>
        </Box>
        <div>
          {/* {value === '1' && <ClassDetailsSection />}
          {value === '2' && <ClassStudentsSection />}
          {value === '3' && <ClassSubjectsSection />}
          {value === '4' && <ClassActionsSection />}
          {value === '5' && <ClassAttendanceSection />} */}
          <CustomTabPanel value={value} index='1'>
            <ClassDetailsSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index='2'>
            <ClassStudentsSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index='3'>
            <ClassSubjectsSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index='4'>
            <ClassActionsSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index='5'>
            <ClassAttendanceSection />
          </CustomTabPanel>
        </div>
      </Container>
    </div>
  )
}

export default DisplayClass;