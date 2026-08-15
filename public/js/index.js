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
import { updateUserData } from './updateUserData';
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
  signupBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const name = `${firstName} ${lastName}`.trim();

    const phoneDigits = document.getElementById('phone').value.replace(/\D/g, '').trim();
    const payload = {
      name,
      email: document.getElementById('email').value.trim(),
      phoneNumber: phoneDigits ? `+251${phoneDigits}` : '',
      role: document.getElementById('role').value,
      password: document.getElementById('password').value,
      passwordConfirm: document.getElementById('confirm-password').value,
    };

    await signup(payload);
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
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title')?.value;
    const type = document.getElementById('property-type')?.value?.toLowerCase().replace(' ', '-');
    const rent = document.getElementById('rent')?.value;
    const city = document.getElementById('city')?.value;
    const subcity = document.getElementById('subcity')?.value;
    const woreda = document.getElementById('woreda')?.value;
    const kebele = document.getElementById('kebele')?.value;
    const bedroom = document.getElementById('bedrooms')?.value;
    const bathroom = document.getElementById('bathrooms')?.value;
    const description = document.getElementById('description')?.value;

    const amenitiesNodes = document.querySelectorAll('input[name="amenity"]:checked');
    const amenities = Array.from(amenitiesNodes).map((node) => node.value);

    const data = {
      title,
      type,
      rent: Number(rent),
      location: {
        city,
        subcity,
        woreda,
        kebele,
      },
      bedroom: parseInt(bedroom, 10),
      bathroom: parseInt(bathroom, 10),
      description,
      amenities,
    };

    postProperty(data);
  });
}
const saveSettingsForm = document.getElementById('userData');
if (saveSettingsForm) {
  saveSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phoneNumber = document.getElementById('userPhone').value;
    
    // Format phone number to Ethiopian format
    let formattedPhone = phoneNumber;
    if (phoneNumber && !phoneNumber.startsWith('+251')) {
      // Remove all non-digits
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length === 9) {
        formattedPhone = '+251' + cleanPhone;
      } else if (cleanPhone.length === 12 && cleanPhone.startsWith('251')) {
        formattedPhone = '+' + cleanPhone;
      }
    }
    
    const data = { name, email, phoneNumber: formattedPhone };
    await updateUserData(data);
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
