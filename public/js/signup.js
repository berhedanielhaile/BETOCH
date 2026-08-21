/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

const setupSignupPhotoUpload = () => {
  const photoInput = document.getElementById('photo');
  if (!photoInput) return;

  const box = photoInput.closest('.form__file-upload');
  if (!box) return;

  const preview = box.querySelector('.form__file-upload-preview');
  const previewImg = box.querySelector('.form__file-upload-preview img');

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (previewImg) previewImg.src = event.target.result;
      if (preview) preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
};

setupSignupPhotoUpload();

const normalizeSignupPayload = (data) => {
  if (data instanceof FormData) {
    return data;
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
