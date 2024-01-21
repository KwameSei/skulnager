import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userState/userSlice';
import { studentReducer } from './studentState/studentSlice';
import { classReducer } from './classState/classSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    studentClass: classReducer,
  }, 
});

export default store;