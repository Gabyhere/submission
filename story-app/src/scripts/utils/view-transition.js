export function useViewTransition(callback) {
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}

export function showHome() {
  useViewTransition(() => {
    document.body.innerHTML = '<main id="main-content">...</main>';
    // ambil data dari API lalu render
  });
}
