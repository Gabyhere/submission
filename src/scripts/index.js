import { showLogin } from './presenters/login-presenter.js';
import { showRegister } from './presenters/register-presenter.js';
import { showHome } from './presenters/home-presenter.js';
import { showAdd } from './presenters/add-presenter.js';
import { showAbout } from './presenters/about-presenter.js';
import { useViewTransition } from './utils/view-transition.js';
import '../styles/styles.css';

const routes = {
  '#/login': showLogin,
  '#/register': showRegister,
  '#/home': showHome,
  '#/add': showAdd,
  '#/about': showAbout,
};

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function router() {
  const path = window.location.hash || '#/login';

  if (!isLoggedIn() && path !== '#/login' && path !== '#/register') {
    location.hash = '#/login';
    return;
  }

  if (isLoggedIn() && (path === '#/login' || path === '#/register')) {
    location.hash = '#/home';
    return;
  }

  const render = routes[path] || showLogin;

  useViewTransition(() => {
    render();
  });

  const headerElement = document.querySelector('header');
  console.log(headerElement);
}

window.addEventListener('click', (e) => {
  if (e.target.id === 'logout-btn') {
    localStorage.removeItem('token');
    location.hash = '#/login';
  }
});

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

window.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.getElementById('skip-link');
  const mainContent = document.getElementById('main-content');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
  const drawerButton = document.getElementById('drawer-button');
  const navigationDrawer = document.getElementById('navigation-drawer');

  drawerButton.addEventListener('click', () => {
    navigationDrawer.classList.toggle('open');
  });
});
