/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'data' ? '/api/v1/user/updateMe' : '/api/v1/user/updateMyPassword';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Profile updated successfully!');
      return res.data.data.user;
    }
  } catch (err) {
    console.error('Error updating settings:', err);
    showAlert('error', err.response?.data?.message || 'Error updating profile!');
    throw err;
  }
};

export const updateUserData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Profile updated successfully!');
      return res.data.data.user;
    }
  } catch (err) {
    console.error('Error updating user data:', err);
    showAlert('error', err.response?.data?.message || 'Error updating profile!');
    throw err;
  }
};

export const savePreferences = async (preferences) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateMe',
      data: preferences,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Preferences saved successfully!');
      return res.data.data.user;
    }
  } catch (err) {
    console.error('Error saving preferences:', err);
    showAlert('error', err.response?.data?.message || 'Error saving preferences!');
    throw err;
  }
};

export const updatePassword = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateMyPassword',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      // Clear form fields
      const passwordCurrent = document.getElementById('passwordCurrent');
      const password = document.getElementById('password');
      const passwordConfirm = document.getElementById('passwordConfirm');
      if (passwordCurrent) passwordCurrent.value = '';
      if (password) password.value = '';
      if (passwordConfirm) passwordConfirm.value = '';
      return res.data.data.user;
    }
  } catch (err) {
    console.error('Error updating password:', err);
    showAlert('error', err.response?.data?.message || 'Error updating password!');
    throw err;
  }
};

export const deleteAccount = async () => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: '/api/v1/user/deleteMe',
    });
    if (res.status === 204) {
      showAlert('success', 'Account deleted successfully');
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.error('Error deleting account:', err);
    showAlert('error', err.response?.data?.message || 'Error deleting account!');
    throw err;
  }
};
