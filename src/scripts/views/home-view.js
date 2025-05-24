import { initMap } from '../utils/map.js';

export default class HomeView {
  constructor() {
    this._root = null;
    this.onRetry = () => {};
    this.onHashChange = () => {};
  }

  mount() {
    this._root = document.querySelector('main#main-content');
    this._root.innerHTML = this._template();

    document.getElementById('nav-list').innerHTML = `
      <li><a href="#/home" class="nav-link">Daftar Cerita</a></li>
      <li><a href="#/add" class="nav-link">Tambah Cerita</a></li>
      <li><a href="#/about" class="nav-link active">Tentang Web</a></li>
      <li><button id="logout-btn" class="logout-btn" aria-label="Logout">Logout</button></li>`;

    this._q('#logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      this.redirectToLogin();
    });

    this._q('#retry-btn')?.addEventListener('click', () => this.onRetry());

    this._hashHandler = () => this.onHashChange();
    window.addEventListener('hashchange', this._hashHandler);
  }

  render(state) {
    this._q('#loading-indicator').style.display = state.isLoading ? 'block' : 'none';

    if (state.error) {
      this._q('#story-list').innerHTML = `
        <p class="error-message">${state.error}</p>
        <button id="retry-btn">Coba Lagi</button>`;
      this._q('#retry-btn')?.addEventListener('click', () => this.onRetry());
      return;
    }

    this._q('#story-list').innerHTML = this._storiesHTML(state.stories);
  }

  addMapsToStories(stories) {
    return stories.map((s, i) => {
      if (!s.lat || !s.lon) return null;
      try {
        const el = this._q(`#map-${i}`);
        if (!el) return null;
        const map = initMap(el, [s.lat, s.lon], 13);
        L.marker([s.lat, s.lon]).addTo(map).bindPopup(`Lokasi ${s.name}`).openPopup();
        return map;
      } catch {
        const el = this._q(`#map-${i}`);
        if (el) el.innerHTML = '<p class="map-error">Peta tidak dapat dimuat</p>';
        return null;
      }
    });
  }

  destroy() {
    window.removeEventListener('hashchange', this._hashHandler);
    this._root = null;
  }

  redirectToLogin() {
    location.hash = '#/auth?mode=login';
  }

  _template() {
    return `
      <section>
        <h2>Daftar Cerita</h2>
        <div id="loading-indicator" class="loading" style="display:none;">Memuat cerita…</div>
        <div id="story-list" class="story-grid"></div>
      </section>`;
  }

  _storiesHTML(stories = []) {
    if (!stories.length) return '<p class="empty-state">Belum ada cerita yang tersedia</p>';

    return stories
      .map(
        (s, i) => `
      <div class="story-card">
        <img src="${s.photoUrl}" alt="Foto ${s.name}" loading="lazy"
             onerror="this.onerror=null;this.src='./images/placeholder.jpg'">
        <div class="story-content">
          <h3>Oleh: ${s.name}</h3>
          <p class="story-desc">${s.description}</p>
          <div class="story-meta">
            ${
              s.lat && s.lon
                ? `<div id="map-${i}" class="story-map" style="height:150px;"
                                    data-lat="${s.lat}" data-lon="${s.lon}"
                                    aria-label="Peta lokasi ${s.name}"></div>`
                : '<p class="map-error">Lokasi tidak tersedia</p>'
            }
            ${
              s.lat && s.lon
                ? `<p class="story-coordinates">
                                   <span>Lat: ${s.lat.toFixed(4)}</span>
                                   <span>Lon: ${s.lon.toFixed(4)}</span>
                                 </p>`
                : ''
            }
            <p class="story-date">${this._formatDate(s.createdAt)}</p>
          </div>
        </div>
      </div>`,
      )
      .join('');
  }

  _formatDate(d) {
    try {
      return new Date(d).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  }

  _q(sel) {
    return this._root.querySelector(sel);
  }
}
