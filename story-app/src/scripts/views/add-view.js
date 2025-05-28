import { createMap } from '../utils/map.js';

export default class AddView {
  constructor() {
    this._root = null;
    this._map = null;
    this.onStartCamera = () => {};
    this.onStopCamera = () => {};
    this.onTakePhoto = () => {};
    this.onRetryPhoto = () => {};
    this.onFileChange = () => {};
    this.onSubmit = () => {};
    this.onMapClick = () => {};
    this._state = {
      cameraActive: false,
      error: null,
    };
  }

  mount() {
    this._root = document.querySelector('main#main-content');
    this._root.innerHTML = this._template();
    document.getElementById('nav-list').innerHTML = `
      <li><a href="#/home" class="nav-link">Daftar Cerita</a></li>
      <li><a href="#/saved-stories" class="nav-link">Saved Stories</a></li>
      <li><a href="#/add" class="nav-link">Tambah Cerita</a></li>
      <li><a href="#/about" class="nav-link active">Tentang Web</a></li>
      <li><button id="logout-btn" class="logout-btn" aria-label="Logout">Logout</button></li>`;

    this._attachListeners();

    this._map = createMap((lat, lng) => this.onMapClick(lat, lng));

    this._addListeners();
  }

  render(state) {
    this._q('#camera-section').style.display = state.cameraActive ? 'block' : 'none';
    this._q('#start-camera').style.display = state.cameraActive ? 'none' : 'block';
    this._q('#stop-camera').style.display = state.cameraActive ? 'block' : 'none';
    this._q('#video').style.display = state.cameraActive ? 'block' : 'none';

    if (state.photo) {
      this._q('#photo-preview').src = URL.createObjectURL(state.photo);
      this._q('#photo-preview').style.display = 'block';
      this._q('#take-photo').style.display = 'none';
      this._q('#retry-photo').style.display = 'inline';
      this._q('#video').style.display = 'none';
    } else {
      this._q('#photo-preview').style.display = 'none';
      this._q('#take-photo').style.display = state.cameraActive ? 'inline' : 'none';
      this._q('#retry-photo').style.display = 'none';
      this._q('#video').style.display = state.cameraActive ? 'block' : 'none';
    }

    if (state.location) {
      this._q('#lat').value = state.location.lat;
      this._q('#lon').value = state.location.lng;
    }

    const submitBtn = this._q('#add-form button[type="submit"]');
    submitBtn.disabled = state.isLoading;
    submitBtn.textContent = state.isLoading ? 'Memproses…' : 'Tambah';

    let err = this._q('#error-message');

    if (state.success) {
      alert('Cerita berhasil ditambahkan!');
      setTimeout(() => {
        this.redirectToHome();
      }, 2000);
    }

    if (state.error) {
      if (!err) {
        err = document.createElement('div');
        err.id = 'error-message';
        err.className = 'error-message';
        this._q('#add-form').prepend(err);
      }
      err.textContent = state.error;
    } else if (err) {
      err.remove();
    }
  }

  setState(newState) {
    this._state = {
      ...this._state,
      ...newState,
    };
    this.render(this._state);
  }

  destroy() {
    this._map?.remove();
    this._map = null;
    this._root = null;
    this._removeListeners();
  }

  _addListeners() {
    this._onHashChange = () => this.onHashChange?.();
    window.addEventListener('hashchange', this._onHashChange);
    window.addEventListener('beforeunload', this._onHashChange);
  }

  _removeListeners() {
    window.removeEventListener('hashchange', this._onHashChange);
    window.removeEventListener('beforeunload', this._onHashChange);
  }

  getVideoElement() {
    return this._q('#video');
  }

  setVideoStream(stream) {
    const video = this._q('#video');
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play().catch((err) => {
        console.error('Gagal memutar video:', err);
      });
    };
  }

  clearVideo() {
    const video = this._q('#video');
    if (video) {
      video.srcObject = null;
    }
  }

  capturePhoto() {
    const video = this.getVideoElement();
    if (!video || !video.srcObject) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          this.onFileChange(blob);
        }
      },
      'image/jpeg',
      0.9,
    );
  }

  redirectToHome() {
    location.hash = '#/home';
  }

  getDescription() {
    return this._q('#description').value.trim();
  }

  _template() {
    return `
      <section>
        <h2>Tambah Cerita</h2>
        <form id="add-form">
          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required aria-required="true"></textarea>

          <label for="photo">Pilih Foto dari Galeri</label>
          <input type="file" id="photo" name="photo" accept="image/*" aria-describedby="photo-help">
          <p id="photo-help">Atau unggah foto dari perangkat Anda</p>

          <fieldset>
            <legend>Kamera Laptop</legend>
            <button type="button" id="start-camera">Aktifkan Kamera</button>
            <button type="button" id="stop-camera" style="display:none;">Nonaktifkan Kamera</button>

            <div id="camera-section" style="display:none;">
              <video id="video" width="320" height="240" aria-label="Video kamera"></video>
              <canvas id="canvas" width="320" height="240" style="display:none;" aria-hidden="true"></canvas>
              <img id="photo-preview" style="display: none;" alt="Preview foto">

              <div>
                <button type="button" id="take-photo">Ambil Foto</button>
                <button type="button" id="retry-photo" style="display:none;">Ulangi Foto</button>
              </div>
            </div>
          </fieldset>

          <label for="lat">Latitude</label>
          <input id="lat" name="lat" type="text" readonly aria-readonly="true">

          <label for="lon">Longitude</label>
          <input id="lon" name="lon" type="text" readonly aria-readonly="true">

          <div id="map" style="height: 300px;" aria-label="Peta lokasi"></div>
          <button type="submit">Tambah</button>
        </form>
      </section>`;
  }

  _attachListeners() {
    this._q('#start-camera')?.addEventListener('click', () => this.onStartCamera());
    this._q('#stop-camera')?.addEventListener('click', () => this.onStopCamera());
    this._q('#take-photo')?.addEventListener('click', () => this.onTakePhoto());
    this._q('#retry-photo')?.addEventListener('click', () => this.onRetryPhoto());
    this._q('#photo')?.addEventListener('change', (e) => this.onFileChange(e.target.files[0]));
    this._q('#add-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = this.getDescription();
      const photo = this._q('#photo').files[0];
      const lat = this._q('#lat').value;
      const lon = this._q('#lon').value;

      this.onSubmit({
        description,
        photo,
        location: lat && lon ? { lat: parseFloat(lat), lng: parseFloat(lon) } : null,
      });
    });
  }

  _q(sel) {
    return this._root.querySelector(sel);
  }

  showError(msg) {
    let err = this._q('#error-message');
    if (!err) {
      err = document.createElement('div');
      err.id = 'error-message';
      err.className = 'error-message';
      this._q('#add-form').prepend(err);
    }
    err.textContent = msg;
  }
}
