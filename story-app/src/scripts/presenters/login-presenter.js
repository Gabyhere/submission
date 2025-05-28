import Model from '../model/story-api.js';
import LoginView from '../views/login-view.js';

export default class LoginPresenter {
  constructor() {
    this.view = new LoginView();
    this.view.onSubmit = this.handleLogin.bind(this);
  }

  show() {
    this.view.mount();
  }

  async handleLogin({ email, password }) {
    try {
      const res = await Model.login(email, password);
      if (!res.error && res.loginResult?.token) {
        Model.setToken(res.loginResult.token);
        this.view.redirectToHome();
      } else {
        this.view.showError(res.message || 'Login gagal');
      }
    } catch (err) {
      this.view.showError(err.message || 'Terjadi kesalahan');
    }
  }
}
