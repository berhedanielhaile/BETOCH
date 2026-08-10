/* eslint-disable*/
import axios from 'axios';

import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/user/login', { password, email });

    if (res.data.status === 'success') {
      showAlert('success', 'successfully logged in');

      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios('/api/v1/user/logout');
    if (res.data.status === 'success') {
      // location.reload(true);
      showAlert('success', 'loggedOut successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'Error logging out');
  }
};
