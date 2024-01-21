import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { CreateClass, CreateStudent, DisplayStudents, AdminHomepage } from '../../../screens';

const AdminDashboard = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminHomepage />} />
        <Route path="/create-student" element={<CreateStudent situation='Student' />} />
        <Route path='/display-students' element={<DisplayStudents />} />
        <Route path='/create-class' element={<CreateClass />} />
      </Routes>
    </div>
  )
}

export default AdminDashboard;