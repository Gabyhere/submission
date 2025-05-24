import Model from '../model/story-api.js';
import HomeView from '../views/home-view.js';

let view = null;
let state = { stories: [], isLoading: false, error: null, maps: [] };

export async function showHome() {
  if (!view) {
    view = new HomeView();
    view.onRetry = () => fetchStories();
    view.onHashChange = cleanupHomePage;
  }

  view.mount();
  view.render(state);

  if (!state.stories.length) fetchStories();
}

export function cleanupHomePage() {
  state.maps.forEach((m) => m?.remove());
  state.maps = [];
  view?.destroy();
  view = null;
}

async function fetchStories() {
  const token = localStorage.getItem('token');
  if (!token) {
    view?.redirectToLogin();
    return;
  }
  setState({ isLoading: true, error: null });
  try {
    const data = await Model.getStories(token);
    if (!data?.listStory) throw new Error('Data tidak valid');

    setState({ stories: data.listStory, isLoading: false });
    renderMaps();
  } catch (err) {
    setState({ error: err.message, isLoading: false });
  }
}

function renderMaps() {
  state.maps = view.addMapsToStories(state.stories);
}

function setState(part) {
  state = { ...state, ...part };
  view?.render(state);
}
