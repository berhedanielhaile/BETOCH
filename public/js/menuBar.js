/* eslint-disable*/
export const openCloseMenubar = (hamburger, nav) => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('active');
};
export const CloseMenubar = (hamburger, nav) => {
  hamburger.classList.remove('active');
  nav.classList.remove('active');
};
// Horizontal scroll for features
export const scroll = (direction, container, value) => {
  direction.addEventListener('click', () => {
    container.scrollBy({ left: value, behavior: 'smooth' });
  });
};
