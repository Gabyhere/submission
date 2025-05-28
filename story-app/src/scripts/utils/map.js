let mapInstance = null;
let markers = [];

export function createMap(onLocationSelected, defaultPosition = [-6.2, 106.8], defaultZoom = 10) {
  if (mapInstance) {
    cleanupMap();
  }

  mapInstance = L.map('map').setView(defaultPosition, defaultZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance);

  mapInstance.on('click', (e) => {
    const { lat, lng } = e.latlng;

    clearMarkers();

    const marker = L.marker([lat, lng]).addTo(mapInstance).bindPopup('Lokasi cerita').openPopup();

    markers.push(marker);

    if (typeof onLocationSelected === 'function') {
      onLocationSelected(lat, lng);
    }
  });

  return mapInstance;
}

export function initMap(container, position, zoom = 13) {
  const map = L.map(container).setView(position, zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  return map;
}

export function cleanupMap() {
  if (mapInstance) {
    mapInstance.off();
    mapInstance.remove();
    mapInstance = null;
  }
  clearMarkers();
}

function clearMarkers() {
  markers.forEach((marker) => marker.remove());
  markers = [];
}

export function getMapInstance() {
  return mapInstance;
}

export function setMapView(coords, zoom = 13) {
  if (mapInstance) {
    mapInstance.setView(coords, zoom);
  }
}
