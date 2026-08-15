/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

export const postProperty = async (data, isEdit = false, propertyId = null) => {
  try {
    let res;
    if (isEdit && propertyId) {
      // Update existing property
      res = await axios.patch(`/api/v1/property/${propertyId}`, data);
    } else {
      // Create new property
      res = await axios.post('/api/v1/property', data);
    }
    
    if (res.data.status === 'success') {
      showAlert('success', isEdit ? 'Property updated successfully!' : 'Property posted successfully!');
      window.setTimeout(() => {
        location.assign('/my-listings');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error saving property!');
  }
};
