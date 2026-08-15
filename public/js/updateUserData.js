/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const updateUserData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Profile updated successfully!');
      console.log('User data updated successfully:', res.data.data.user);
      return res.data.data.user;
    }
  } catch (err) {
    console.error('Error updating user data:', err);
    showAlert('error', err.response?.data?.message || 'Error updating profile!');
    throw err;
  }
};
