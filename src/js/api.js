const BASE_URL = `http://localhost:8080/api`;

export function getMarkers() {
  return getJsonFromFetch(`${BASE_URL}/markers`);
}

function getJsonFromFetch(url) {
  return fetch(url)
    .then(response => response.json());
}
