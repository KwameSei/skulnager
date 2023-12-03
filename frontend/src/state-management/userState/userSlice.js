import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  userInfo: [],
  tempUserInfo: [],
  error: null,
  loading: false,
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
  token: localStorage.getItem('token') || null,
  response: null,
  responseStatus: null,
  darkMode: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    authRequest: (state) => {
      state.status = 'loading';
    },
    underControl: (state) => {
      state.status = 'idle';
      state.response = null;
    },
    authSuccess: (state, action) => {
      state.status = 'success';
      state.currentUser = action.payload;
      state.currentRole = action.payload.role;
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.response = null;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.status = 'failed';
      state.response = action.payload;
      state.error = action.payload;
    },
    authError: (state, action) => {
      state.status = 'error';
      state.response = action.payload;
      state.error = action.payload;
    },
    authLogout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.currentUser = null;
      state.status = 'idle';
      state.token = null;
      state.currentRole = null;
      state.response = null;
      state.responseStatus = null;
      state.error = null;
    },
    authDeleteSuccess: (state, action) => {
      localStorage.removeItem('user');
      state.userInfo = null;
      state.loading = false;
      state.response = null;
      state.error = null;
    },
    authUpdateSuccess: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.userInfo = action.payload;
      state.loading = false;
      state.response = null;
      state.error = null;
    },
    authUpdateFailure: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = action.payload;
    },
    getRequest: (state) => {
      state.loading = true;
    },
    getFailure: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = null;
    },
    getSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.response = null;
      state.error = null;
    },
    getEror: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = action.payload;
    },
    StaffAdded: (state, action) => {
      state.status = 'added';
      state.loading = false;
      state.response = null;
      state.error = null;
      state.tempUserInfo = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFailure,
  authError,
  authLogout,
  authUpdateSuccess,
  authUpdateFailure,
  authDeleteSuccess,
  getRequest,
  getSuccess,
  getFailure,
  getEror,
  StaffAdded,
  underControl,
  toggleDarkMode,
} = userSlice.actions;

export const userReducer = userSlice.reducer;