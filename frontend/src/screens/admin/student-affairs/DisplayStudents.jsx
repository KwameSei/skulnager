import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getFailure, getError, getRequest, getSuccess, setSchoolId } from '../../../state-management/studentState/studentSlice';
import axios from 'axios';
import { Box } from '@mui/system';
import { CustomTable, Loading, Popup } from '../../../components';
import { Button, ButtonGroup, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, SpeedDialAction } from '@mui/material';
import { ArrowDropDownOutlined, ArrowDropUp, ArrowDropUpOutlined, Delete, GroupWork, PersonAddAlt, PersonRemove } from '@mui/icons-material';
import { BlackButton, BlueButton, GreenButton, WhiteButton } from '../../../components/ButtonStyled';

const DisplayStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const anchorRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const options = ['Take Attendance', 'Provide Marks'];
  
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentUser?.admin?.role);
  const currentRoleFromLocalStorage = localStorage.getItem('currentRole');
  const students = useSelector(state => state.student.students)
  const response = useSelector(state => state.student.response);
  const schoolID = useSelector(state => state.student.school);

  console.log('School ID', schoolID);

  const URL = import.meta.env.VITE_SERVER_URL;

  const getAllStudents = () => async (dispatch, getState) => {
    dispatch(getRequest());
  
    try {
      const token = currentUser?.token || '';

      // Get the schoolId from the backend
      // const response = await axios.get(`${URL}/api/student/get-school-id`, {
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
      //   }
      // });
      // console.log('This is the school id response', response);

      // const schoolId = response.data.schoolId;
      // console.log('This is the schoolId', schoolId);

      // dispatch(setSchoolId(schoolId));
  
      // Make the request with the obtained schoolId
      const res = await axios.get(`${URL}/api/student/get-all-students`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ''}`,
        }
      });
      
      console.log('This is the response', res);
  
      const studentData = res.data.students;
      console.log('This is the student data', studentData);
  
      dispatch(getSuccess(studentData));
    } catch (error) {
      dispatch(getFailure({ error: error.message }));
    }
  };  

  useEffect(() => {
    if (currentUser) {
      if (currentUser.admin) {
        dispatch(getAllStudents());
      }
    }
  }, [currentUser]);

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNumber', label: 'Student Number', minWidth: 100 },
    { id: 'sclassName', label: 'Class', minWidth: 170 },
  ]

  const studentRows = students && students.length > 0 && students.map((student) => {
    return {
      name: student.name,
      rollNumber: student.rollNumber,
      sclassName: student.sclassName.sclassName,
      id: student._id,
    };
  })

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
    if (selectedIndex === 0) {
      handleAttendance();
    } else if (selectedIndex === 1) {
      handleMarks();
    }
  };

  const handleAttendance = (row) => {
    navigate(`/take-attendance/${row.id}`);
  }
  const handleMarks = (row) => {
    navigate(`/provide-marks/${row.id}`);
  }
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${URL}/api/student/delete-student/${id}`);
      const { message } = response.data;
      setMessage(message);
      setShowPopup(true);
      dispatch(getAllStudents());
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit-student/${id}`);
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const StudentButtonHaver = ({ row }) => {
    const options = ['Take Attendance', 'Provide Marks'];

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/take-attendance/${row.id}`);
    }

    const handleMarks = () => {
      navigate(`/provide-marks/${row.id}`);
    }

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    return (
      <>
        <IconButton onClick={() => handleDelete(row.id, 'Student')}>
          <PersonRemove />
        </IconButton>
        <BlueButton variant='contained' onClick={() => navigate(`/admin-dashboard/display-student/${row.id}`)}>
          View
        </BlueButton>
        <React.Fragment>
          <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <GreenButton
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
            </GreenButton>
          </ButtonGroup>
          <Popper
            sx={{zIndex: 1}}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          onClick={(event) => handleMenuItemClick(event, index)}
                          selected={index === selectedIndex}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      </>
    );
  }

  return (
    <>
      {loading ?
        <Loading />
        : 
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <GreenButton variant='contained' onClick={() => navigate('/admin-dashboard/create-student')}>
                Add Student
              </GreenButton>
            </Box>
            : 
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(students) && students.length > 0 &&
                <CustomTable
                  columns={studentColumns}
                  rows={studentRows}
                  buttonHaver={StudentButtonHaver}
                />
              }
              <SpeedDialAction actions={moreActions} />
            </Paper>
          }
        </>
      }
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} message={message} />
    </>
  );
};

const moreActions = [
  {
    icon: <PersonAddAlt />, name: 'Add Student',
    action: () => navigate('/create-student')
  },
  {
    icon: <PersonRemove />, name: 'Delete Student',
    action: () => deleteHandler(currentUser._id, 'Student')
  },
];

export default DisplayStudents;
