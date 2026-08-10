/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

export const postProperty = async (data) => {
  try {
    const res = await axios.post('/api/v1/property', data);
    if (res.data.status === 'success') {
      showAlert('success', 'Property posted successfully!');
      window.setTimeout(() => {
        location.assign('/my-listings');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error posting property!');
  }
};
