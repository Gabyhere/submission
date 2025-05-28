import Model from '../model/story-api.js';
import HomeView from '../views/home-view.js';

export default class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.state = { stories: [], isLoading: false, error: null, maps: [] };

    this.view.onRetry = this.fetchStories.bind(this);
    this.view.onHashChange = this.cleanupHomePage.bind(this);
  }

  show() {
    this.view.mount();
    this.view.render(this.state);

    if (!this.state.stories.length) this.fetchStories();
  }

  async fetchStories() {
    const token = Model.getToken();
    if (!token) {
      this.view.redirectToLogin();
      return;
    }
    this.setState({ isLoading: true, error: null });
    try {
      const data = await Model.getStories(token);
      if (!data?.listStory) throw new Error('Data tidak valid');

      this.setState({ stories: data.listStory, isLoading: false });
      this.renderMaps();
    } catch (err) {
      this.setState({ error: err.message, isLoading: false });
    }
  }

  renderMaps() {
    this.state.maps = this.view.addMapsToStories(this.state.stories);
  }

  setState(part) {
    this.state = { ...this.state, ...part };
    this.view.render(this.state);
  }

  cleanupHomePage() {
    this.state.maps.forEach((m) => m?.remove());
    this.state.maps = [];
    this.view?.destroy();
  }
}
