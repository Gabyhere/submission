export default class AboutView {
  constructor() {
    this._el = null;
    this.onDestroyRequest = () => {};
    this._boundHashChange = this._onHashChange.bind(this);
  }

  render() {
    const template = `
      <section class="about-page">
        <div class="about-container">
        <article class="about-card">
          <header class="about-header">
            <h2 class="about-title">Tentang Aplikasi</h2>
            <div class="about-badge">Versi 1.0.0</div>
          </header>
            
            <div class="about-text">
              <p>Aplikasi ini dikembangkan oleh <strong>Gabriella Adeline Halim</strong> sebagai proyek submission untuk Course Belajar Pengembangan Web Intermediate</p>
              
              <h3 class="mt-3">Fitur Utama:</h3>
              <ul class="feature-list">
                <li>Membuat, melihat, dan membagikan cerita</li>
                <li>Integrasi dengan kamera dan lokasi</li>
                <li>Autentikasi pengguna</li>
                <li>Responsive design</li>
              </ul>
              
              <h3 class="mt-3">Teknologi yang Digunakan:</h3>
              <div class="tech-stack">
                <span class="tech-item">JavaScript</span>
                <span class="tech-item">Web Components</span>
                <span class="tech-item">Leaflet Maps</span>
              </div>
            </div>
            </div>
          </div>
          
          <footer class="about-footer">
            <p>Kode sumber akan dimasukkan di <a href="https://github.com/Gabyhere/submission" target="_blank" rel="noopener">GitHub</a> setelah direview dan diterima</p>
          </footer>
        </article>
      </div>
      </main>
    `;

    document.querySelector('main#main-content').innerHTML = template;

    document.getElementById('nav-list').innerHTML = `
      <li><a href="#/home" class="nav-link">Daftar Cerita</a></li>
      <li><a href="#/add" class="nav-link">Tambah Cerita</a></li>
      <li><a href="#/about" class="nav-link active">Tentang Web</a></li>
      <li><button id="logout-btn" class="logout-btn" aria-label="Logout">Logout</button></li>`;

    this._el = document.body.querySelector('.about-page');

    this._el.querySelector('#logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      this.navigateToLogin();
    });

    window.addEventListener('hashchange', this._boundHashChange);
  }

  destroy() {
    this._el?.querySelector('#logout-btn')?.removeEventListener('click', this.onLogout);
    window.removeEventListener('hashchange', this._boundHashChange);
    this._el = null;
  }

  _onHashChange() {
    this.onDestroyRequest();
  }

  navigateToLogin() {
    window.location.hash = '#/auth?mode=login';
  }
}
