/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const requestViewingBtn = document.getElementById('request-viewing-btn');
const listingSidebar = document.querySelector('.listing-detail__sidebar');

const updateRequestUI = (status) => {
  if (!requestViewingBtn) return;

  if (status === 'accepted') {
    requestViewingBtn.disabled = true;
    requestViewingBtn.textContent = 'Request accepted';
    requestViewingBtn.dataset.enquiryStatus = 'accepted';
  } else if (status === 'declined') {
    requestViewingBtn.disabled = true;
    requestViewingBtn.textContent = 'Request declined';
    requestViewingBtn.dataset.enquiryStatus = 'declined';
  } else if (status === 'pending') {
    requestViewingBtn.disabled = true;
    requestViewingBtn.textContent = 'Request sent';
    requestViewingBtn.dataset.enquiryStatus = 'pending';
  } else {
    requestViewingBtn.disabled = false;
    requestViewingBtn.textContent = 'Request viewing';
    requestViewingBtn.dataset.enquiryStatus = '';
  }
};

const syncButtonState = () => {
  if (!requestViewingBtn) return;

  const hasRequest = listingSidebar?.dataset.hasRequest === 'true';
  if (hasRequest) {
    updateRequestUI(requestViewingBtn.dataset.enquiryStatus || 'pending');
  } else {
    updateRequestUI('');
  }
};

const getPropertyId = () => listingSidebar?.dataset.propertyId;

const displayStatus = (message, isError = false) => {
  showAlert(isError ? 'error' : 'success', message);
};

const createEnquiry = async (payload) => {
  const propertyId = getPropertyId();
  if (!propertyId) {
    displayStatus('Unable to identify the property.', true);
    return null;
  }

  try {
    const res = await axios.post('/api/v1/enquiries', {
      ...payload,
      property: propertyId,
    });
    if (res.data?.status === 'success') {
      displayStatus('Viewing request sent successfully!');
      return res.data;
    }
    displayStatus('Unable to send your request. Please try again.', true);
    return null;
  } catch (err) {
    displayStatus(err.response?.data?.message || 'Failed to send enquiry.', true);
    console.error('Enquiry error', err);
    return null;
  }
};

const getUserName = () => listingSidebar?.dataset.userName || '';

const submitViewingRequest = async (event) => {
  event.preventDefault();
  const userName = getUserName();
  const result = await createEnquiry({
    message: userName ? `${userName} requested to view your property.` : 'A user requested to view your property.',
    type: 'viewing_request',
  });
  if (result) {
    updateRequestUI('pending');
  }
};

const pollForResponse = async () => {
  const propertyId = getPropertyId();
  if (!propertyId || !requestViewingBtn || requestViewingBtn.dataset.enquiryStatus === '') return;

  try {
    const res = await axios.get(`/api/v1/enquiries/me/${propertyId}`);
    const enquiry = res.data?.data?.data;
    if (!enquiry) return;

    const currentStatus = enquiry.status || 'pending';
    if (requestViewingBtn.dataset.enquiryStatus !== currentStatus) {
      updateRequestUI(currentStatus);
      if (currentStatus === 'accepted') {
        showAlert('success', 'Your request was accepted by the landlord.');
      } else if (currentStatus === 'declined') {
        showAlert('error', 'The landlord declined your request.');
      }
    }
  } catch (err) {
    console.error('Unable to check request status', err);
  }
};

if (requestViewingBtn) {
  syncButtonState();
  requestViewingBtn.addEventListener('click', submitViewingRequest);
  window.setInterval(pollForResponse, 5000);
}
