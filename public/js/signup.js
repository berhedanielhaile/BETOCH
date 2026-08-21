/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

const setupSignupPhotoUpload = () => {
  const photoInput = document.getElementById('photo');
  if (!photoInput) return;

  const box = photoInput.closest('.form__file-upload');
  if (!box) return;

  const preview = box.querySelector('.form__file-upload-preview');
  const placeholder = box.querySelector('.form__file-upload-placeholder');
  const removeBtn = box.querySelector('.form__file-upload-remove');
  const previewImg = box.querySelector('.form__file-upload-preview img');

  const showPreview = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) previewImg.src = e.target.result;
      if (placeholder) placeholder.style.display = 'none';
      if (preview) preview.style.display = 'block';
      if (removeBtn) removeBtn.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    photoInput.value = '';
    if (previewImg) previewImg.src = '';
    if (placeholder) placeholder.style.display = 'flex';
    if (preview) preview.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'none';
  };

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) showPreview(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearPreview();
    });
  }
};

setupSignupPhotoUpload();

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
