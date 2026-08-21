/* eslint-disable*/
import '@babel/polyfill';
import { signup } from './signup';
import { login, logout } from './login';

import { openCloseMenubar, CloseMenubar, scroll } from './menuBar';
import { applyFilters, buildFilteredFormData, handleUrlParams } from './filterProperties';
import './propertyDetail';
import './enquiries';
import { postProperty } from './postproperty';
import axios from 'axios';
import { updateUserData, updatePassword, savePreferences, deleteAccount } from './updateSettings';
import { showAlert } from './alert';

////// DOM ELEMENTS
const signupBtn = document.getElementById('signup');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');
const postForm = document.getElementById('post');

const hamburger = document.getElementById('hamburger-btn');
const nav = document.getElementById('main-nav');

const settingsNavLinks = document.querySelectorAll('.settings-nav-link');
const settingsSections = document.querySelectorAll('.settings-tab');

const scrollContainer = document.getElementById('feature-scroll');
const scrollLeft = document.getElementById('scroll-left');
const scrollRight = document.getElementById('scroll-right');

const testimonialsContainer = document.getElementById('testimonials-scroll');
const testimonialsLeft = document.getElementById('testimonials-scroll-left');
const testimonialsRight = document.getElementById('testimonials-scroll-right');

const form = document.getElementById('filterProperties');
const submitBtn = document.querySelector('#filterProperties button[type="submit"]');
const filterBtn = document.getElementById('filterProperties');
const sortSelect = document.getElementById('sort');

const searchBtn = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

const filterToggle = document.getElementById('filter-toggle');
const filtersContent = document.getElementById('filters-content');

/////DElEGATION

//menubar open and close
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    openCloseMenubar(hamburger, nav);
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      CloseMenubar(hamburger, nav);
    }
  });
}
// Horizontal scroll for features
if (scrollContainer && scrollLeft && scrollRight) {
  scroll(scrollLeft, scrollContainer, -360);
  scroll(scrollRight, scrollContainer, 360);
}

// Horizontal scroll for testimonials
if (testimonialsContainer && testimonialsLeft && testimonialsRight) {
  scroll(testimonialsLeft, testimonialsContainer, -420);
  scroll(testimonialsRight, testimonialsContainer, 420);
}

//////////////////////////////////////////
//sign up
if (signupBtn) {
  // Photo upload preview for signup
  const photoInput = document.getElementById('photo');
  const fileUploadPreview = document.querySelector('.form__file-upload-preview');
  
  if (photoInput && fileUploadPreview) {
    photoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Remove placeholder and show image
          const placeholder = fileUploadPreview.querySelector('.form__file-upload-placeholder');
          if (placeholder) {
            placeholder.remove();
          }
          
          // Check if preview image already exists
          let previewImage = fileUploadPreview.querySelector('.form__file-upload-preview-image');
          if (!previewImage) {
            previewImage = document.createElement('img');
            previewImage.className = 'form__file-upload-preview-image';
            fileUploadPreview.appendChild(previewImage);
          }
          
          previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  signupBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const name = `${firstName} ${lastName}`.trim();

    const phoneDigits = document.getElementById('phone').value.replace(/\D/g, '').trim();
    const photoFile = document.getElementById('photo').files[0];
    
    // Use FormData for file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', document.getElementById('email').value.trim());
    formData.append('phoneNumber', phoneDigits ? `+251${phoneDigits}` : '');
    formData.append('role', document.getElementById('role').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('passwordConfirm', document.getElementById('confirm-password').value);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    await signup(formData);
  });
}
//////////////////////////////////////////
//login
if (loginBtn) {
  loginBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}
//logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}
// filter functionality
if (filterBtn) {
  filterBtn.addEventListener('submit', async (e) => {
    e.preventDefault();

    const filteredFormData = buildFilteredFormData(form, sortSelect);
    await applyFilters(filteredFormData, submitBtn);
  });
}
// sort functionality
if (sortSelect) {
  sortSelect.addEventListener('change', async () => {
    const filteredFormData = buildFilteredFormData(form, sortSelect);
    await applyFilters(filteredFormData, submitBtn);
  });
}
if (searchBtn) {
  searchBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchValue = searchInput?.value?.trim();
    if (searchValue) {
      // Redirect to property-listings page with search parameter in URL
      location.assign(`/property-listings?location.subcity=${encodeURIComponent(searchValue)}`);
    } else {
      // If no search value, just redirect to property-listings
      location.assign('/property-listings');
    }
  });
}
//post listing
if (postForm) {
  const photosInput = document.getElementById('photos');
  const videoInput = document.getElementById('video');
  const photoPreview = document.getElementById('photo-preview');
  const videoPreview = document.getElementById('video-preview');
  const uploadAreas = document.querySelectorAll('.post-listing__upload');

  const updatePhotoPreview = () => {
    if (!photoPreview) return;
    photoPreview.innerHTML = '';
    const files = photosInput.files;
    if (!files.length) return;
    Array.from(files).forEach((file, index) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '6rem';
      wrapper.style.height = '6rem';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '0.5rem';
      img.style.border = '1px solid #ddd';
      img.dataset.index = index;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.style.cssText = 'position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;padding:0;';
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentFiles = Array.from(photosInput.files);
        currentFiles.splice(index, 1);
        const dt = new DataTransfer();
        currentFiles.forEach((f) => dt.items.add(f));
        photosInput.files = dt.files;
        updatePhotoPreview();
      });

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      photoPreview.appendChild(wrapper);
    });
  };

  const updateVideoPreview = () => {
    if (!videoPreview) return;
    videoPreview.innerHTML = '';
    const file = videoInput.files[0];
    if (!file) return;
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '30rem';

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.style.width = '100%';
    video.style.borderRadius = '0.5rem';
    video.style.border = '1px solid #ddd';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.style.cssText = 'position:absolute;top:8px;right:8px;background:#ef4444;color:#fff;border:none;border-radius:50%;width:24px;height:24px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;padding:0;';
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoInput.value = '';
      updateVideoPreview();
    });

    wrapper.appendChild(video);
    wrapper.appendChild(removeBtn);
    videoPreview.appendChild(wrapper);
  };

  uploadAreas.forEach((area) => {
    area.addEventListener('click', () => {
      const input = area.querySelector('input[type="file"]');
      if (input) input.click();
    });
  });

  if (photosInput) {
    photosInput.addEventListener('change', updatePhotoPreview);
  }
  if (videoInput) {
    videoInput.addEventListener('change', updateVideoPreview);
  }

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value.trim());
    formData.append('type', document.getElementById('property-type').value.toLowerCase());
    formData.append('rent', document.getElementById('rent').value);
    formData.append('bedroom', document.getElementById('bedrooms').value);
    formData.append('bathroom', document.getElementById('bathrooms').value);
    formData.append('description', document.getElementById('description').value.trim());

    const location = {
      city: document.getElementById('city').value.trim(),
      subcity: document.getElementById('subcity').value,
      woreda: document.getElementById('woreda').value.trim(),
      kebele: document.getElementById('kebele').value.trim(),
    };
    formData.append('location', JSON.stringify(location));

    const amenitiesNodes = document.querySelectorAll('input[name="amenity"]:checked');
    const amenities = Array.from(amenitiesNodes).map((node) => node.value);
    formData.append('amenities', JSON.stringify(amenities));

    if (photosInput && photosInput.files.length > 0) {
      Array.from(photosInput.files).forEach((file) => {
        formData.append('photos', file);
      });
    }

    if (videoInput && videoInput.files.length > 0) {
      formData.append('video', videoInput.files[0]);
    }

    const isEdit = postForm.dataset.isEdit === 'true';
    const propertyId = postForm.dataset.propertyId || null;

    await postProperty(formData, isEdit, propertyId);
  });
}

// Account settings form handlers
const userDataForm = document.getElementById('userDataForm');
if (userDataForm) {
  // Profile photo click handler
  const profilePhotoWrapper = document.querySelector('.form__profile-photo-wrapper');
  const photoChangeBtn = document.querySelector('.form__profile-photo-change');
  const photoInput = document.getElementById('photo');
  
  const triggerPhotoUpload = () => {
    if (photoInput) photoInput.click();
  };
  
  if (profilePhotoWrapper && photoInput) {
    profilePhotoWrapper.addEventListener('click', triggerPhotoUpload);
    photoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const profileImage = document.querySelector('.form__profile-photo-image');
          if (profileImage) {
            profileImage.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  if (photoChangeBtn && photoInput) {
    photoChangeBtn.addEventListener('click', triggerPhotoUpload);
  }
  
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phoneNumber = document.getElementById('userPhone').value;
    const bio = document.getElementById('userBio')?.value || '';
    const photoFile = document.getElementById('photo').files[0];
    
    // Format phone number to Ethiopian format
    let formattedPhone = phoneNumber;
    if (phoneNumber && !phoneNumber.startsWith('+251')) {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length === 9) {
        formattedPhone = '+251' + cleanPhone;
      } else if (cleanPhone.length === 12 && cleanPhone.startsWith('251')) {
        formattedPhone = '+' + cleanPhone;
      }
    }
    
    // Use FormData for file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', formattedPhone);
    formData.append('bio', bio);
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    
    const updatedUser = await updateUserData(formData);
    if (updatedUser && updatedUser.photo) {
      const preview = document.querySelector('.form__profile-photo-image');
      if (preview) {
        preview.src = `/img/users/${updatedUser.photo}?t=${Date.now()}`;
      }
      const headerAvatar = document.querySelector('.header__nav--avatar');
      if (headerAvatar) {
        headerAvatar.src = `/img/users/${updatedUser.photo}?t=${Date.now()}`;
      }
    }
  });
}

const passwordForm = document.getElementById('updatePasswordForm');
if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    await updatePassword({ passwordCurrent, password, passwordConfirm });
  });
}

const notificationsForm = document.getElementById('notificationsForm');
if (notificationsForm) {
  // Set initial checkbox values based on user preferences
  const notifEnquiriesCheckbox = document.getElementById('notifEnquiries');
  const notifAccountCheckbox = document.getElementById('notifAccount');
  
  // Get user data from the page or make an API call to set initial values
  // For now, we'll fetch the current user data to set the checkbox states
  fetch('/api/v1/user/me')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success' && data.data.user.notificationPreferences) {
        notifEnquiriesCheckbox.checked = data.data.user.notificationPreferences.enquiries !== false;
        notifAccountCheckbox.checked = data.data.user.notificationPreferences.account !== false;
      }
    })
    .catch(err => {
      console.log('Could not fetch user preferences:', err);
      // Default to checked if we can't fetch
      notifEnquiriesCheckbox.checked = true;
      notifAccountCheckbox.checked = true;
    });
  
  notificationsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const notifEnquiries = document.getElementById('notifEnquiries').checked;
    const notifAccount = document.getElementById('notifAccount').checked;
    
    const preferences = { notifEnquiries, notifAccount };
    await savePreferences(preferences);
  });
}

const deleteBtn = document.getElementById('delete-account-btn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (confirm('This will permanently delete all your listings, enquiries, and personal data. Continue?')) {
        await deleteAccount();
      }
    }
  });
}

// Handle URL parameters on page load (for search from homepage)
handleUrlParams();

// Filter toggle functionality for mobile

if (filterToggle && filtersContent) {
  filterToggle.addEventListener('click', () => {
    filtersContent.classList.toggle('listings__filters-content--active');
    filterToggle.classList.toggle('listings__filter-toggle--active');
  });
}

// Error details toggle functionality
const errorDetailsToggle = document.getElementById('error-details-toggle');
const errorDetailsContent = document.getElementById('error-details-content');
if (errorDetailsToggle && errorDetailsContent) {
  errorDetailsToggle.addEventListener('click', () => {
    const isHidden = errorDetailsContent.style.display === 'none';
    errorDetailsContent.style.display = isHidden ? 'block' : 'none';
    errorDetailsToggle.classList.toggle('error-page__details-toggle-btn--active');
    errorDetailsToggle.querySelector('span').textContent = isHidden ? 'Hide Error Details' : 'Show Error Details';
  });
}
// account settings sidebar tabs
if (settingsNavLinks.length && settingsSections.length) {
  const updateActiveLink = (activeLink) => {
    settingsNavLinks.forEach((link) => {
      link.classList.toggle('settings-nav-link--active', link === activeLink);
    });
  };

  settingsNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateActiveLink(link);
      if (history.replaceState) history.replaceState(null, '', targetId);
    });
  });

  const sectionData = [...settingsSections].map((section) => ({
    id: section.id,
    section,
  }));

  const onScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.25;
    let activeSection = sectionData[0];
    sectionData.forEach((data) => {
      if (data.section.offsetTop <= scrollPosition) {
        activeSection = data;
      }
    });
    const activeLink = document.querySelector(`.settings-nav-link[href="#${activeSection.id}"]`);
    if (activeLink) updateActiveLink(activeLink);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Forgot password form
const forgotPasswordForm = document.getElementById('forgotPassword');
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) {
      showAlert('error', 'Please enter your email address.');
      return;
    }
    try {
      const res = await axios.post('/api/v1/user/forgetPassword', { email });
      if (res.data.status === 'success') {
        showAlert('success', 'Password reset link sent! Check your email.');
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Error sending reset email.');
    }
  });
}

// Reset password form
const resetPasswordForm = document.getElementById('resetPassword');
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const resetToken = resetPasswordForm.dataset.resetToken;

    if (!password || !passwordConfirm) {
      showAlert('error', 'Please fill in both password fields.');
      return;
    }
    if (password.length < 8) {
      showAlert('error', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirm) {
      showAlert('error', 'Passwords do not match.');
      return;
    }

    try {
      const res = await axios.patch(`/api/v1/user/resetPassword/${resetToken}`, {
        password,
        passwordConfirm,
      });
      if (res.data.status === 'success') {
        showAlert('success', 'Password updated! Redirecting to login...');
        setTimeout(() => {
          location.assign('/login');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Error resetting password.');
    }
  });
}
