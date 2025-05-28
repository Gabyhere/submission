import AboutView from '../views/about-view.js';

export default class AboutPresenter {
  constructor() {
    this.view = new AboutView();
    this.view.onDestroyRequest = this.cleanupAboutPage.bind(this);
  }

  show() {
    this.view.render();
  }

  cleanupAboutPage() {
    this.view?.destroy();
  }
}
