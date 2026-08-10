/*eslint-disable*/

import axios from 'axios';

// Helper: escape HTML to avoid injection when rendering
export const escapeHtml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Render listings into the grid
export const renderListings = (payload) => {
  const properties = payload?.data?.data || payload?.data || payload || [];
  const countEl = document.querySelector('.listings__count');
  const grid = document.querySelector('.listings__grid');
  if (!grid) return;

  if (countEl)
    countEl.textContent =
      properties.length === 0
        ? 'No properties found for the specified fields!'
        : `Showing ${properties.length} properties in Addis Ababa`;

  grid.innerHTML = properties
    .map((p) => {
      const img = (p.photos && (p.photos[1] || p.photos[0])) || 'property-1-main.jpg';
      const subcity = p.location?.subcity || '';
      const city = p.location?.city || '';
      return `
<a class="listing-card" href="/${p.slug}">
  <div class="listing-card__img-wrap">
    <img class="listing-card__img" src="/img/properties/${escapeHtml(img)}" alt="${escapeHtml(p.title || '')}" onerror="this.src='/img/properties/property-1-main.jpg'">
    <span class="listing-card__tag">${escapeHtml(p.type || '')}</span>
  </div>
  <div class="listing-card__body">
    <p class="listing-card__price">&pound; ${escapeHtml(p.rent || '')} <span>/ month</span></p>
    <p class="listing-card__type">${escapeHtml(p.type || '')}</p>
    <p class="listing-card__location">${escapeHtml(subcity)}, ${escapeHtml(city)}</p>
    <div class="listing-card__meta">
      <span class="listing-card__meta-item">${escapeHtml(p.bedroom || '')}
        <svg class="listing-card__icon"><use xlink:href="/css/icons-sprite.svg#icon-bed"></use></svg>
      </span>
      <span class="listing-card__meta-item">${escapeHtml(p.bathroom || '')}
        <svg class="listing-card__icon"><use xlink:href="/css/icons-sprite.svg#icon-bath"></use></svg>
      </span>
    </div>
  </div>
</a>`;
    })
    .join('');
};

export const showSpinner = () => {
  const sp = document.getElementById('filter-spinner');
  if (sp) sp.style.display = 'inline-block';
};

export const hideSpinner = () => {
  const sp = document.getElementById('filter-spinner');
  if (sp) sp.style.display = 'none';
};

export const filterProperties = async (formData) => {
  if (!formData || typeof formData.entries !== 'function') {
    return null;
  }

  const values = Object.fromEntries(formData.entries());
  console.log('filter form values:', values);

  const params = new URLSearchParams();
  
  // Handle location filtering - the form uses 'location' but API expects 'location.subcity'
  if (values.location) params.append('location.subcity', values.location.trim());
  
  if (values.type) params.append('type', values.type.toLowerCase().replace(/\s+/g, '-'));
  if (values['min-price']) params.append('rent[gte]', values['min-price']);
  if (values['max-price']) params.append('rent[lte]', values['max-price']);
  if (values.bedrooms) {
    const bedroomValue = values.bedrooms.replace('+', '');
    if (bedroomValue) params.append('bedroom[gte]', bedroomValue);
  }
  if (values.sort) params.append('sort', values.sort);

  const url = `/api/v1/property${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await axios.get(url);
  return res.data;
};
export const buildFilteredFormData = (form, sortSelect, searchInput) => {
  if (!form) return null;

  const rawFormData = new FormData(form);
  const filteredFormData = new FormData();

  for (const [key, value] of rawFormData.entries()) {
    if (value != null && value !== '') {
      filteredFormData.append(key, value);
    }
  }

  if (sortSelect?.value) {
    filteredFormData.append('sort', sortSelect.value);
  }
  
  return filteredFormData;
};
export const applyFilters = async (formData, submitBtn) => {
  if (!formData) return;
  if (submitBtn) submitBtn.disabled = true;
  showSpinner();

  try {
    const filterResult = await filterProperties(formData);
    renderListings(filterResult);
  } catch (err) {
    console.error('Filter error', err);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    hideSpinner();
  }
};

// Function to handle URL parameters on page load
export const handleUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const locationValue = urlParams.get('location.subcity');
  
  if (locationValue) {
    // Set the location input value in the filter form
    const locationInput = document.getElementById('location');
    if (locationInput) {
      locationInput.value = locationValue;
    }
    
    // Apply the filter with the URL parameter using the existing filter form
    const form = document.getElementById('filterProperties');
    if (form) {
      // Create FormData from the form and ensure location is set
      const formData = new FormData(form);
      formData.set('location', locationValue);
      
      // Apply the filters using the existing function
      const submitBtn = document.querySelector('#filterProperties button[type="submit"]');
      applyFilters(formData, submitBtn);
    }
  }
};
