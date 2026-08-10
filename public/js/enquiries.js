/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const handleResponse = async (button, action) => {
  const enquiryId = button?.dataset.enquiryId;
  if (!enquiryId) return;

  const responseForm = button.closest('.enquiry-card__response-form');
  const contactPreference = responseForm?.querySelector('[name="contactPreference"]')?.value || 'phone';
  const contactValue = responseForm?.querySelector('[name="contactValue"]')?.value?.trim() || '';

  try {
    const res = await axios.patch(`/api/v1/enquiries/${enquiryId}/respond`, {
      action,
      contactPreference,
      contactValue,
    });

    if (res.data?.status === 'success') {
      showAlert('success', action === 'decline' ? 'Request declined.' : 'Request accepted.');
      window.location.reload();
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Unable to update the request.');
  }
};

const bindButtons = () => {
  document.querySelectorAll('[data-enquiry-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      handleResponse(button, button.dataset.enquiryAction);
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindButtons);
} else {
  bindButtons();
}
