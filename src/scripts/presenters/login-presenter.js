import Model from '../model/story-api.js';
import LoginView from '../views/login-view.js';

let view = null;

export function showLogin() {
  if (!view) {
    view = new LoginView();
    view.onSubmit = handleLogin;
  }
  view.mount();
}

async function handleLogin({ email, password }) {
  try {
    const res = await Model.login(email, password);
    if (!res.error && res.loginResult?.token) {
      localStorage.setItem('token', res.loginResult.token);
      view.redirectToHome();
    } else {
      view.showError(res.message || 'Login gagal');
    }
  } catch (err) {
    view.showError(err.message || 'Terjadi kesalahan');
  }
}
