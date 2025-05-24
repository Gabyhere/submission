import Model from '../model/story-api.js';
import AddView from '../views/add-view.js';

let view = null;
let state = {
  photo: null,
  location: null,
  isLoading: false,
  error: null,
  success: false,
  cameraActive: false,
};
let media = null;

export function showAdd() {
  if (!view) {
    view = new AddView();
    view.onStartCamera = initCamera;
    view.onStopCamera = stopCamera;
    view.onTakePhoto = takePhoto;
    view.onRetryPhoto = () => setState({ photo: null });
    view.onFileChange = (file) => {
      stopCamera();
      setState({ photo: file });
    };
    view.onMapClick = (lat, lng) => setState({ location: { lat, lng } });
    view.onSubmit = handleSubmit;
    view.onHashChange = cleanupAddPage;
  }

  view.mount();
  view.render(state);
}

export function cleanupAddPage() {
  stopCamera();
  view?.destroy();
  view = null;
}

async function initCamera() {
  if (media) stopCamera();
  try {
    console.log('Mengaktifkan kamera...');
    media = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    view.setVideoStream(media);
    media.getVideoTracks()[0].onended = () => setState({ cameraActive: false });
    setState({ cameraActive: true, error: null });
  } catch (err) {
    setState({ error: 'Tidak dapat mengakses kamera', cameraActive: false });
  }
}

function stopCamera() {
  if (media) {
    media.getTracks().forEach((track) => track.stop());
    media = null;
  }
  view.clearVideo();
  setState({ cameraActive: false });
}

function takePhoto() {
  view.capturePhoto();
}

async function handleSubmit({ description, photo, location }) {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('description', description);

    const finalPhoto = photo || state.photo;
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

    setState({ success: true });
    view.redirectToHome();
  } catch (err) {
    view.showError(err.message || 'Terjadi kesalahan');
  }
}

function setState(part) {
  state = { ...state, ...part };
  view?.render(state);
}
