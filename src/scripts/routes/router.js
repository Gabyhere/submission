import { showLogin } from '../presenters/login-presenter';
import { showHome } from '../presenters/home-presenter';
import { showAdd } from '../presenters/add-presenter';
import { showAbout } from '../presenters/about-presenter';

const routes = {
  '#/login': showLogin,
  '#/home': showHome,
  '#/add': showAdd,
  '#/about': showAbout,
};

function router() {
  const token = localStorage.getItem('token');
  const hash = window.location.hash;

  if (!token && (hash === '#/home' || hash === '' || hash === '#/')) {
    window.location.hash = '#/login';
    return;
  }

  switch (hash) {
    case '#/home':
      showHome();
      break;
    case '#/login':
      showLogin();
      break;
    case '#/register':
      showRegister();
      break;
    default:
      showLogin();
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.hash = '#/login';
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
