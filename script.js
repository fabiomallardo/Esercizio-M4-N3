const API_KEY = "B0J6R6uBnRL2XUaNb6xS2zWflzItGHR5OXCGwv6jGRBJPhOgBhB5uqYq";
const BASE_URL = "https://api.pexels.com/v1/search";

const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchQuery");
const gallery = document.getElementById("gallery");

// Funzione per fare la fetch dei dati
function fetchImages(query) {
  fetch(`${BASE_URL}?query=${query}`, {
    headers: {
      Authorization: API_KEY
    }
  })
    .then((response) => {
      if (!response.ok) {
        gallery.innerHTML = `<div class="alert alert-danger">Errore nella risposta dal server: ${response.status}</div>`;
        return Promise.reject("Errore HTTP: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.photos || !Array.isArray(data.photos)) {
        // Gestione errore: nessuna proprietà `photos`
        gallery.innerHTML = `<div class="alert alert-warning">Nessuna immagine trovata o risposta malformata!</div>`;
        console.error("Risposta API non valida:", data);
        return;
      }

      // Filtra immagini valide
      const filteredPhotos = data.photos.filter((photo) => photo.src && photo.src.medium);

      // Crea le card HTML
      const photoCards = filteredPhotos.map((photo) => createPhotoCard(photo)).join("");

      // Mostra le card nella galleria
      gallery.innerHTML = photoCards;
    })
    .catch((error) => {
      console.error("Errore nella fetch:", error);
      gallery.innerHTML = `<div class="alert alert-danger">Errore nel recupero dati!</div>`;
    });
}

// Funzione per creare una card HTML
function createPhotoCard(photo) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="${photo.src.medium}" class="card-img-top" alt="${photo.alt}">
        <div class="card-body">
          <h5 class="card-title">${photo.photographer}</h5>
          <a href="${photo.url}" target="_blank" class="btn btn-primary">Vedi su Pexels</a>
        </div>
      </div>
    </div>
  `;
}

// Event listener per il pulsante di ricerca
searchBtn.addEventListener("click", () => {
  const query = searchQuery.value.trim();

  if (!query) {
    gallery.innerHTML = `<div class="alert alert-warning">Inserisci una parola chiave per cercare immagini!</div>`;
    return;
  }

  fetchImages(query);
});
