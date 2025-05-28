import Model from '../model/story-api.js';
import RegisterView from '../views/register-view.js';

export default class RegisterPresenter {
  constructor() {
    this.view = new RegisterView();
    this.view.onSubmit = this.handleRegister.bind(this);
  }

  show() {
    this.view.mount();
  }

  async handleRegister({ name, email, password }) {
    try {
      const res = await Model.register(name, email, password);
      if (!res.error) {
        this.view.showSuccess('Berhasil daftar, silakan login');
        this.view.redirectToLogin();
      } else {
        this.view.showError(res.message || 'Gagal daftar');
      }
    } catch (err) {
      this.view.showError(err.message || 'Terjadi kesalahan');
    }
  }
}
