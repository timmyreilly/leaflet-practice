const BASE_URL = `${window.location.origin}/api`;

export function getMarkers() {
  return getJsonFromFetch(`${BASE_URL}/markers`);
}

function getJsonFromFetch(url) {
  return fetch(url)
    .then(response => response.json());
}
