export default class LoginView {
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
    this._q('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit({
        email: this._q('#email').value.trim(),
        password: this._q('#password').value.trim(),
      });
    });
  }

  showError(msg) {
    let err = this._q('#error-message');
    if (!err) {
      err = document.createElement('div');
      err.id = 'error-message';
      err.className = 'error-message';
      this._q('#login-form').prepend(err);
    }
    err.textContent = msg;
  }

  redirectToHome() {
    location.hash = '#/home';
  }

  _template() {
    return `
      <section class="auth-page">
        <h2>Login</h2>
        <form id="login-form">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required>
          <label for="password">Password</label>
          <input id="password" name="password" type="password" required>
          <button type="submit">Login</button>
          <p>Belum punya akun? <a href="#/register">Daftar</a></p>
        </form>
      </section>`;
  }

  _q(sel) {
    return this._root.querySelector(sel);
  }
}
