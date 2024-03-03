import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { 
  CreateClass,
  DisplayClass,
  DisplayAllClasses,
  CreateStudent, 
  DisplayStudents, 
  AdminHomepage, 
  StudentAttendance, 
  AddSubject,
  CreateTeacher, 
} from '../../../screens';

const AdminDashboard = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminHomepage />} />
        <Route path="/create-student" element={<CreateStudent situation='Student' />} />
        <Route path='/display-students' element={<DisplayStudents />} />
        <Route path='/create-class' element={<CreateClass />} />
        <Route path='/display-class/:id' element={<DisplayClass />} />
        <Route path='/create-teacher' element={<CreateTeacher />} />
        <Route path='/display-all-classes' element={<DisplayAllClasses />} />
        <Route path='/student-attendance/:id' element={<StudentAttendance />} />
        <Route path='/add-subject' element={<AddSubject />} />
      </Routes>
    </div>
  )
}

export default AdminDashboard;