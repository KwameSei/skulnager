import axios from 'axios';
import {
  authRequest,
  authSuccess,
  authFailure,
  authError,
  authLogout,
  authUpdateFailure,
  authDeleteSuccess,
  getRequest,
  getSuccess,
  getFailure,
  getError,
  StaffAdded,
  underControl,
  toggleDarkMode,
} from './userSlice';

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  const URL = import.meta.env.VITE_SERVER_URL; 

  try {
    const response = await axios.post(`${URL}/api/admin/${role}login`, fields, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.role) {
      dispatch(authSuccess(response.data));
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    } else {
      dispatch(authFailure(response.data.message));
    }
  } catch (error) {
    dispatch(authError(error.message));
  }
};

export const registerUser = (fields, role, navigate) => async (dispatch) => {

  dispatch(authRequest());

  const URL = import.meta.env.VITE_SERVER_URL;

  try {
    const response = await axios.post(`${URL}/api/admin/register/${role}`, fields, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.schoolName) {
      dispatch(authSuccess(response.data));
      navigate('/admin/dashboard');
      // localStorage.setItem('userInfo', JSON.stringify(response.data));
    } else if (response.data.school) {
      dispatch(StaffAdded(response.data));
      // localStorage.setItem('userInfo', JSON.stringify(response.data));
    } else {
      dispatch(authFailure(response.data.message));
    }

    // Return the response data
    return response;
  } catch (error) {
    dispatch(authError(error.message));
    throw error;
  }
}

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch(authLogout());
};

export const getUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  const URL = import.meta.env.VITE_SERVER_URL;

  try {
    const response = await axios.get(`${URL}/api/admin/${address}/${id}`);

    if (response.data) {
      dispatch(authSuccess(response.data));
    } else {
      dispatch(getFailure(response.data.message));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const updateUser = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  const URL = import.meta.env.VITE_SERVER_URL;

  try {
    const response = await axios.put(`${URL}/api/admin/${address}/update`, fields, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data) {
      dispatch(authSuccess(response.data));
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    } else {
      dispatch(authUpdateFailure(response.data.message));
    }
  } catch (error) {
    dispatch(authError(error.message));
  }
};

export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(authRequest());

  const URL = import.meta.env.VITE_SERVER_URL;

  try {
    const response = await axios.delete(`${URL}/api/admin/${address}/${id}`);

    if (response.data) {
      dispatch(authDeleteSuccess());
      localStorage.removeItem('userInfo');
    } else {
      dispatch(authUpdateFailure(response.data.message));
    }
  } catch (error) {
    dispatch(authError(error.message));
  }
};

// export const toggleDarkMode = () => (dispatch) => {
//   dispatch(toggleDarkMode());
// };

export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  const URL = import.meta.env.VITE_SERVER_URL;

  try {
    const response = await axios.post(`${URL}/api/admin/${address}create`, fields, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Registration response:', response.data);

    if (response.data) {
      dispatch(StaffAdded(response.data));
    } else {
      dispatch(authUpdateFailure(response.data.message));
    }
  } catch (error) {
    dispatch(authError(error.message));
  }
};