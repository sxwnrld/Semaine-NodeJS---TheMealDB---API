const resultats = document.getElementById('resultats');
const message = document.getElementById('message');
const pagination = document.getElementById('pagination');
const numPage = document.getElementById('num-page');
const btnPrecedent = document.getElementById('btn-precedent');
const btnSuivant = document.getElementById('btn-suivant');
const selectCategorie = document.getElementById('select-categorie');
const inputNom = document.getElementById('input-nom');

let page = 1;
let totalPages = 1;

function afficherRecettes(recettes, avecIngredients) {
  resultats.innerHTML = '';

  for (const recette of recettes) {
    const carte = document.createElement('article');
    carte.className = 'carte';

    const image = document.createElement('img');
    image.src = recette.image;
    image.alt = recette.nom;

    const contenu = document.createElement('div');
    contenu.className = 'contenu';

    const titre = document.createElement('h2');
    titre.textContent = recette.nom;

    const infos = document.createElement('p');
    infos.textContent = `${recette.categorie} - ${recette.pays} - ${recette.nbIngredients} ingrédients`;

    contenu.appendChild(titre);
    contenu.appendChild(infos);

    if (avecIngredients) {
      const liste = document.createElement('ul');
      for (const ingredient of recette.ingredients) {
        const li = document.createElement('li');
        li.textContent = `${ingredient.nom} (${ingredient.quantite})`;
        liste.appendChild(li);
      }
      contenu.appendChild(liste);
    }

    carte.appendChild(image);
    carte.appendChild(contenu);
    resultats.appendChild(carte);
  }
}

async function chargerListe() {
  message.textContent = 'Chargement...';

  const reponse = await fetch(`/api/recettes?page=${page}&limit=12`);
  const data = await reponse.json();

  if (!reponse.ok) {
    message.textContent = data.erreur;
    return;
  }

  totalPages = data.totalPages;
  message.textContent = `${data.total} recettes`;
  numPage.textContent = `Page ${data.page} / ${data.totalPages}`;
  btnPrecedent.disabled = page <= 1;
  btnSuivant.disabled = page >= totalPages;
  pagination.style.display = 'flex';

  afficherRecettes(data.recettes, false);
}

async function chargerCategories() {
  const reponse = await fetch('/api/categories');
  const data = await reponse.json();

  if (!reponse.ok) {
    return;
  }

  for (const categorie of data.categories) {
    const option = document.createElement('option');
    option.value = categorie.nom;
    option.textContent = `${categorie.nom} (${categorie.nbRecettes})`;
    selectCategorie.appendChild(option);
  }
}

async function rechercher() {
  const nom = inputNom.value.trim();
  const categorie = selectCategorie.value;

  // pas de filtre = on revient à la liste normale
  if (!nom && !categorie) {
    page = 1;
    chargerListe();
    return;
  }

  const params = new URLSearchParams();
  if (nom) params.append('nom', nom);
  if (categorie) params.append('categorie', categorie);

  message.textContent = 'Recherche...';

  const reponse = await fetch('/api/recettes/recherche?' + params.toString());
  const data = await reponse.json();

  if (!reponse.ok) {
    message.textContent = data.erreur;
    return;
  }

  pagination.style.display = 'none';
  message.textContent = `${data.total} résultat(s)`;
  afficherRecettes(data.recettes, false);
}

async function auHasard() {
  const reponse = await fetch('/api/recettes/hasard');
  const recette = await reponse.json();

  if (!reponse.ok) {
    message.textContent = recette.erreur;
    return;
  }

  pagination.style.display = 'none';
  message.textContent = 'Une recette au hasard :';
  afficherRecettes([recette], true);
}

document.getElementById('form-recherche').addEventListener('submit', (event) => {
  event.preventDefault();
  rechercher();
});

document.getElementById('btn-hasard').addEventListener('click', auHasard);

btnPrecedent.addEventListener('click', () => {
  page--;
  chargerListe();
});

btnSuivant.addEventListener('click', () => {
  page++;
  chargerListe();
});

chargerCategories();
chargerListe();
