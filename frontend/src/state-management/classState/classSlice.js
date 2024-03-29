import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studentClass: null,
  classList: [],
  classStudents: [],
  classDetails: [],
  subjects: [],
  subjectDetails: [],
  subjectId: null,
  classId: null,
  loading: false,
  subloading: false,
  error: null,
  response: null,
  statestatus: 'idle',
  getresponse: null,
};

const classSlice = createSlice({
  name: 'studentClass',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      console.log('getSuccess payload:', action.payload);
      state.loading = false;
      state.error = null;
      state.classList = action.payload || [];
      state.response = null;
    },
    getSubjects: (state, action) => {
      state.loading = false;
      state.error = null;
      state.subjects = action.payload || [];
      state.response = null;
    },
    getFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.classList = [];
      state.response = action.payload;
    },
    getFailureTwo: (state, action) => {
      state.loading = false;
      state.error = null;
      state.classList = [];
      state.classStudents = [];
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
    },
    resetStatus: (state) => {
      state.statestatus = 'idle';
    },
    underClassControl: (state, action) => {
      state.loading = false;
      state.error = null;
      state.response = action.payload;
      state.statestatus = 'idle';
    },
    getStudentsRequest: (state) => {
      state.subloading = true;
    },
    getStudentsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.classStudents = action.payload;
      state.getresponse = null;
    },
    getStudentsFailure: (state, action) => {
      state.subloading = false;
      state.error = action.payload;
      state.classStudents = [];
      state.response = action.payload;
    },
    getStudentsError: (state, action) => {
      state.subloading = false;
      state.error = action.payload;
      state.response = action.payload;
    },
    getSubjectsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.subjects = action.payload;
      state.response = null;
    },
    resetSubjects: (state) => {
      state.subjects = [];
      state.classList = [];
    },
    setSubjectId: (state, action) => {
      state.subjectId = action.payload;
    },
    setClassId: (state, action) => {
      state.classId = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.classDetails = action.payload;
      state.response = null;
    },
    getSubDetailsRequest: (state) => {
      state.subloading = true;
    },
    getSubDetailsSuccess: (state, action) => {
      state.subloading = false;
      state.error = null;
      state.subjectDetails = action.payload;
      state.response = null;
    },
    resetStudentsStatus: (state) => {
      state.statestatus = 'idle';
    },
    underStudentsControl: (state, action) => {
      state.subloading = false;
      state.error = null;
      state.response = action.payload;
      state.statestatus = 'idle';
    },
    getDetailsRequest: (state) => {
      state.subloading = true;
    },
    getDetailsSuccess: (state, action) => {
      state.subloading = false;
      state.error = null;
      state.classDetails = action.payload;
      state.response = null;
    }
  } 
});

export const {
  getRequest,
  getSuccess,
  getSubjects,
  getFailure,
  stuffDone,
  getError,
  resetStatus,
  underClassControl,
  getStudentsRequest,
  getStudentsSuccess,
  getStudentsFailure,
  getStudentsError,
  getSubjectsSuccess,
  resetSubjects,
  detailsSuccess,
  setSubjectId,
  setClassId,
  getSubDetailsRequest,
  getSubDetailsSuccess,
  resetStudentsStatus,
  underStudentsControl,
  getDetailsRequest,
  getDetailsSuccess,
  getFailureTwo
} = classSlice.actions;

export const classReducer = classSlice.reducer;