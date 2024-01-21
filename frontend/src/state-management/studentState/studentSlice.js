import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  student: null,
  students: [],
  loading: false,
  error: null,
  response: null,
  statestatus: 'idle',
  schoolId: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.student = action.payload;
      state.students = action.payload;
      state.response = null;
    },
    setSchoolId: (state, action) => {
      state.schoolId = action.payload;
    },
    getFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.student = null;
      state.students = [];
      state.response = action.payload;
    },
    stuffDone: (state, action) => {
      state.loading = false;
      state.error = null;
      state.statestatus = 'added';
      state.response = action.payload;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.response = action.payload;
    },
    resetStatus: (state) => {
      state.statestatus = 'idle';
    },
    underStudentControl: (state, action) => {
      state.loading = false;
      state.error = null;
      state.response = action.payload;
      state.statestatus = 'idle';
    },
  }
});

export const {
  getRequest,
  getSuccess,
  getFailure,
  stuffDone,
  getError,
  resetStatus,
  setSchoolId,
  underStudentControl,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;