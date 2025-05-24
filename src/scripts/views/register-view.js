export default class RegisterView {
  constructor() {
    this._root = null;
    this.onSubmit = () => {};
  }

  mount() {
    this._root = document.querySelector('main#main-content');
    this._root.innerHTML = this._template();
    document.getElementById('nav-list').innerHTML = `
    <li><a href="#/login" class="nav-link">Login</a></li>
    <li><a href="#/register" class="nav-link">Register</a></li>`;
    this._q('#register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit({
        name: this._q('#name').value.trim(),
        email: this._q('#email').value.trim(),
        password: this._q('#password').value.trim(),
      });
    });
  }

  showError(msg) {
    this._showMessage(msg, 'error-message');
  }

  showSuccess(msg) {
    this._showMessage(msg, 'success-message');
  }

  redirectToLogin() {
    location.hash = '#/login';
  }

  _showMessage(msg, className) {
    let msgBox = this._q('#form-message');
    if (!msgBox) {
      msgBox = document.createElement('div');
      msgBox.id = 'form-message';
      msgBox.className = className;
      this._q('#register-form').prepend(msgBox);
    }
    msgBox.className = className;
    msgBox.textContent = msg;
  }

  _template() {
    return `
      <section class="auth-page">
        <h2>Register</h2>
        <form id="register-form">
          <label for="name">Nama</label>
          <input id="name" name="name" type="text" required>

          <label for="email">Email</label>
          <input id="email" name="email" type="email" required>

          <label for="password">Password</label>
          <input id="password" name="password" type="password" required>

          <button type="submit">Register</button>
          <p>Sudah punya akun? <a href="#/login">Login</a></p>
        </form>
      </section>`;
  }

  _q(sel) {
    return this._root.querySelector(sel);
  }
}
