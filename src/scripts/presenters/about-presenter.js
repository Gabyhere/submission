import AboutView from '../views/about-view.js';

let view = null;

export function showAbout() {
  if (!view) {
    view = new AboutView();
    view.onDestroyRequest = cleanupAboutPage;
  }

  view.render();
}

export function cleanupAboutPage() {
  view?.destroy();
  view = null;
}
