import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, IconButton, ListItem, Menu, MenuItem, Tooltip, SpeedDial, SpeedDialAction } from '@mui/material';
import { Delete, PostAdd, PersonAddAlt1, AddCard } from '@mui/icons-material';
import { BlackButton, BlueButton, RedButton, GreenButton } from '../../../components/ButtonStyled';
import { CustomTable, AltTable } from '../../../components';
import styled from 'styled-components';

import { getSuccess, setClassId } from '../../../state-management/classState/classSlice';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DisplayAllClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { id } = useParams();
  // console.log('Class ID:', id);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);

  const currentUser = useSelector((state) => state.user);
  const { classList, loading, error, getresponse } = useSelector((state) => state.studentClass);
  // const id = useSelector((state) => state.studentClass.id);
  console.log('Class list', classList);

  const adminId = currentUser?.admin?.id;
  const URL = import.meta.env.VITE_SERVER_URL;

  // Fetch all classes
  const fetchAllClasses = async () => {
    const token = currentUser.token;

    try {
      const res = await axios.get(`${URL}/api/class/get-all-classes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      
      const classData = res.data.allClasses;

      dispatch(getSuccess(classData));
      toast.success(res.data.message);

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllClasses();

    // dispatch(setClassId(id));
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const deleteHandler = () => {
    navigate('/admin-dashboard');
  }

  const addHandler = () => {
    navigate('/admin-dashboard');
  }

  const editHandler = () => {
    navigate('/admin-dashboard');
  }

  // const viewHandler = (id) => {
  //   navigate(`/admin-dashboard/display-class/${id}`);
  // }
  
  const handleAction = (action, row) => {
    switch (action) {
      case 'view':
        navigate(`/admin-dashboard/display-class/${row.id}`);
        break;
      case 'edit':
        // Handle edit action
        break;
      case 'delete':
        // Handle delete action
        break;
      case 'add':
        navigate(`/admin-dashboard/create-class/`)
        break;
      default:
        console.error(`Unsupported action: ${action}`);
    }
  };

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'sclassName', label: 'Class Name', minWidth: 100 },
    { id: 'classCode', label: 'Class Code', minWidth: 100 },
    { id: 'students', label: 'Number of Students', minWidth: 100 },
    { id: 'classTeacherEmail', label: 'Class Teacher Email', minWidth: 100 },
    { id: 'classTeacherPhone', label: 'Class Teacher Phone', minWidth: 100 },
    { id: 'createdAt', label: 'Created At', minWidth: 100 },
    { id: 'updatedAt', label: 'Updated At', minWidth: 100 },
  ];

  const rows = classList && classList.length > 0 && classList.map((classes) => {
    return {
      id: classes._id,
      sclassName: classes.sclassName,
      classCode: classes.classCode,
      students: classes.students.length,
      classTeacherEmail: classes.classTeacherEmail,
      classTeacherPhone: classes.classTeacherPhone,
      createdAt: classes.createdAt,
      updatedAt: classes.updatedAt,
    };
  })

  // const actions = [
  //   {
  //     icon: <Delete />,
  //     name: 'Delete',
  //     handler: deleteHandler,
  //   },
  //   {
  //     icon: <PostAdd />,
  //     name: 'Add',
  //     handler: addHandler,
  //   },
  //   {
  //     icon: <PersonAddAlt1 />,
  //     name: 'Edit',
  //     handler: editHandler,
  //   },
  //   // {
  //   //   icon: <AddCard />,
  //   //   name: 'View',
  //   //   handler: viewHandler,
  //   // }
  // ];
  
  return (
    <>
    {loading ?
      <h2>Loading...</h2>
      : 
      <>
        {getresponse ?
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <GreenButton onClick={() => addHandler()} variant='contained' color='primary'>
              Add Class
            </GreenButton>
          </Box>
          :
          <>
            <AltTable columns={columns} rows={rows} handleAction={handleAction} />


            <SpeedDial
              // actions={actions}
              open={open}
              onOpen={handleOpen}
              onClose={handleClose}
              ariaLabel='Actions'
              sx={{ position: 'absolute', bottom: 16, right: 16 }}
            />
          </>
        }
      </>
    }
    </>
  )
}

export default DisplayAllClasses;