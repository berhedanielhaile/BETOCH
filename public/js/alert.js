/* eslint-disable*/
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el && el.parentElement) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, msg) => {
  hideAlert();

  const normalizedType = type === 'error' ? 'error' : 'success';
  const icon = normalizedType === 'error' ? '✕' : '✓';
  const markup = `
    <div class="alert alert--${normalizedType}" role="status" aria-live="polite">
      <span class="alert__icon" aria-hidden="true">${icon}</span>
      <span class="alert__message">${msg}</span>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5200);
};
