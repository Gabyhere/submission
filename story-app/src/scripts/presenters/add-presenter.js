import Model from '../model/story-api.js';
import AddView from '../views/add-view.js';
import { startCamera } from '../utils/camera.js';

export default class AddPresenter {
  constructor() {
    this.view = new AddView();
    this.state = {
      photo: null,
      location: null,
      isLoading: false,
      error: null,
      success: false,
      cameraActive: false,
    };

    this.view.onStartCamera = this.initCamera.bind(this);
    this.view.onStopCamera = this.stopCamera.bind(this);
    this.view.onTakePhoto = this.takePhoto.bind(this);
    this.view.onFileChange = (file) => {
      this.stopCamera();
      this.setState({ photo: file });
    };
    this.view.onMapClick = (lat, lng) => this.setState({ location: { lat, lng } });
    this.view.onSubmit = this.handleSubmit.bind(this);
  }

  show() {
    this.view.mount();
    this.view.render(this.state);
  }

initCamera() {
  const videoElement = this.view.getVideoElement();
  if (videoElement) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoElement.srcObject = stream;
      videoElement.play().catch((err) => console.error('Video play error:', err));
    }).catch((err) => {
      console.error('Tidak dapat mengakses kamera:', err);
    });
    this.setState({ cameraActive: true });
  }
}

stopCamera() {
  const videoElement = this.view.getVideoElement();
  if (videoElement && videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
  this.setState({ cameraActive: false });
}

  takePhoto() {
    this.view.capturePhoto();
  }

  async handleSubmit({ description, photo, location }) {
    try {
      const token = Model.getToken();
      const formData = new FormData();
      formData.append('description', description);

      const finalPhoto = photo || this.state.photo;
      if (finalPhoto) {
        formData.append('photo', finalPhoto, 'photo.jpg');
      } else {
        throw new Error('Foto wajib diunggah atau diambil melalui kamera');
      }

      if (location?.lat && location?.lng) {
        formData.append('lat', location.lat);
        formData.append('lon', location.lng);
      }

      const res = await Model.addStory(token, formData);
      if (res.error) throw new Error(res.message || 'Gagal menambahkan cerita');

      this.setState({ success: true });
      this.view.redirectToHome();
    } catch (err) {
      this.view.showError(err.message || 'Terjadi kesalahan');
    }
  }

  setState(part) {
    this.state = { ...this.state, ...part };
    this.view.render(this.state);
  }
}
