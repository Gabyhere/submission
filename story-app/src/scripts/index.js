import LoginPresenter from './presenters/login-presenter.js';
import RegisterPresenter from './presenters/register-presenter.js';
import HomePresenter from './presenters/home-presenter.js';
import AddPresenter from './presenters/add-presenter.js';
import AboutPresenter from './presenters/about-presenter.js';
import SavedStoriesView from './views/saved-stories-view.js';
import { useViewTransition } from './utils/view-transition.js';
import { stopCamera } from './utils/camera.js';
import '../styles/styles.css';

const loginPresenter = new LoginPresenter();
const registerPresenter = new RegisterPresenter();
const homePresenter = new HomePresenter();
const addPresenter = new AddPresenter();
const aboutPresenter = new AboutPresenter();

const routes = {
  '#/login': () => loginPresenter.show(),
  '#/register': () => registerPresenter.show(),
  '#/home': () => homePresenter.show(),
  '#/add': () => addPresenter.show(),
  '#/about': () => aboutPresenter.show(),
  '#/saved-stories': () => SavedStoriesView.render(),
};

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function router() {
  stopCamera();

  const path = window.location.hash || '#/login';

  if (!isLoggedIn() && path !== '#/login' && path !== '#/register') {
    location.hash = '#/login';
    return;
  }

  if (isLoggedIn() && (path === '#/login' || path === '#/register')) {
    location.hash = '#/home';
    return;
  }

  const render = routes[path] || (() => loginPresenter.show());

  useViewTransition(() => {
    render();
  });
}

// Logout
window.addEventListener('click', (e) => {
  if (e.target.id === 'logout-btn') {
    localStorage.removeItem('token');
    location.hash = '#/login';
  }
});

// Skip Link dan Drawer
window.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.getElementById('skip-link');
  const mainContent = document.getElementById('main-content');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      skipLink.blur();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  const drawerButton = document.getElementById('drawer-button');
  const navigationDrawer = document.getElementById('navigation-drawer');
  drawerButton?.addEventListener('click', () => {
    navigationDrawer.classList.toggle('open');
  });
});

// Hash Routing
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

let swRegistration = null;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(async (registration) => {
      console.log('Service Worker registered:', registration.scope);
      swRegistration = registration;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Izin notifikasi ditolak!');
        return;
      }

      setupPushButtons();
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

function setupPushButtons() {
  const subscribeBtn = document.getElementById('subscribe-btn');
  const unsubscribeBtn = document.getElementById('unsubscribe-btn');

  subscribeBtn.style.display = 'inline-block';
  unsubscribeBtn.style.display = 'none';

  subscribeBtn.addEventListener('click', async () => {
    try {
      const vapidKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      const existingSubscription = await swRegistration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Langganan sudah ada:', JSON.stringify(existingSubscription));
        alert('Kamu sudah subscribe!');
        subscribeBtn.style.display = 'none';
        unsubscribeBtn.style.display = 'inline-block';
        return;
      }

      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      console.log('Push Subscription:', JSON.stringify(subscription));
      alert('Berhasil subscribe!');

      subscribeBtn.style.display = 'none';
      unsubscribeBtn.style.display = 'inline-block';

      // Kirim subscription ke server API Dicoding jika ada endpoint
    } catch (err) {
      console.error('Gagal subscribe:', err);
    }
  });

  unsubscribeBtn.addEventListener('click', async () => {
    try {
      const subscription = await swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        alert('Berhasil unsubscribe!');
      }

      subscribeBtn.style.display = 'inline-block';
      unsubscribeBtn.style.display = 'none';

      // Hapus subscription dari server API jika ada
    } catch (err) {
      console.error('Gagal unsubscribe:', err);
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
