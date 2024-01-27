import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teacher: null,
  teachers: [],
  teacherDetails: [],
  loading: false,
  error: null,
  response: null,
  statestatus: "idle",
  schoolId: null,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.teacher = action.payload;
      state.teachers = action.payload;
      state.response = null;
    },
    doneSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.teacherDetails = action.payload;
      state.response = null;
    },
    setSchoolId: (state, action) => {
      state.schoolId = action.payload;
    },
    getFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.teacher = null;
      state.teachers = [];
      state.response = action.payload;
    },
    stuffDone: (state, action) => {
      state.loading = false;
      state.error = null;
      state.statestatus = "added";
      state.response = action.payload;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.response = action.payload;
    },
    resetStatus: (state) => {
      state.statestatus = "idle";
    },
    underTeacherControl: (state, action) => {
      state.loading = false;
      state.error = null;
      state.response = action.payload;
      state.statestatus = "idle";
    },
  },
});
