// Array con frases filosóficas y de escritores
const phrases = [
  "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir adelante. - Albert Einstein",
  "El único modo de hacer un gran trabajo es amar lo que haces. - Steve Jobs",
  "No hay caminos para la paz; la paz es el camino. - Mahatma Gandhi",
  "La felicidad no es algo hecho. Proviene de tus propias acciones. - Dalai Lama",
  "Pienso, luego existo. - René Descartes",
  "El hombre es la medida de todas las cosas. - Protágoras",
  "La única verdadera sabiduría está en saber que no sabes nada. - Sócrates",
  "Sé tú el cambio que quieres ver en el mundo. - Mahatma Gandhi",
  "En medio de la dificultad reside la oportunidad. - Albert Einstein",
  "El tiempo es la cosa más valiosa que una persona puede gastar. - Theophrastus"
];

// Historias de ejemplo (puedes reemplazar con datos reales o cargar desde un API)
const stories = [
  { title: "El viaje del héroe", content: "" },
  { title: "La noche estrellada", content: "" },
  { title: "El despertar", content: "" },
  { title: "Caminos cruzados", content: "" },
  { title: "La última carta", content: "" }
];

// Elementos DOM
const phraseEl = document.getElementById('phrase-of-day');
const searchInput = document.getElementById('search-input');
const cardsContainer = document.getElementById('cards-container');

// Mostrar frase aleatoria
function showRandomPhrase() {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  phraseEl.textContent = phrases[randomIndex];
}
showRandomPhrase();
setInterval(showRandomPhrase, 120000); // Cada 2 minutos

// Crear tarjeta
function createCard(story) {
  const card = document.createElement('div');
  card.className = 'card';
  const hasContent = story.content.trim() !== '';
  const title = hasContent ? story.title : 'Próximamente...';
  const content = hasContent ? story.content : 'Pronto habrá contenido...';
  card.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
  return card;
}

// Mostrar historias
function showStories(filteredStories) {
  cardsContainer.innerHTML = '';

  if (filteredStories.length === 0) {
    cardsContainer.innerHTML = '<p>No se encontraron historias.</p>';
    return;
  }

  filteredStories.forEach(story => {
    const card = createCard(story);
    cardsContainer.appendChild(card);
  });
}

showStories(stories);

// Filtrar historias
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = stories.filter(story =>
    story.title.toLowerCase().includes(query) || story.content.toLowerCase().includes(query)
  );
  showStories(filtered);
});
