/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

const normalizeSignupPayload = (data) => {
  if (data instanceof FormData) {
    return data; // Return FormData as-is for multipart upload
  }

  return data;
};

export const signup = async (data) => {
  try {
    const payload = normalizeSignupPayload(data);
    
    const res = await axios.post('/api/v1/user/signup', payload);

    if (res.data.status === 'success') {
      location.assign('/dashboard');
      showAlert('success', 'Signed up successfully.');
    }
  } catch (err) {
    const message = err.response?.data?.message || 'Signup failed. Please try again.';
    showAlert('error', message);
  }
};
