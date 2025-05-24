import Model from '../model/story-api.js';
import RegisterView from '../views/register-view.js';

let view = null;

export function showRegister() {
  if (!view) {
    view = new RegisterView();
    view.onSubmit = handleRegister;
  }
  view.mount();
}

async function handleRegister({ name, email, password }) {
  try {
    const res = await Model.register(name, email, password);
    if (!res.error) {
      view.showSuccess('Berhasil daftar, silakan login');
      view.redirectToLogin();
    } else {
      view.showError(res.message || 'Gagal daftar');
    }
  } catch (err) {
    view.showError(err.message || 'Terjadi kesalahan');
  }
}
