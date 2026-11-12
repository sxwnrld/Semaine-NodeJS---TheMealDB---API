const { transformerRecette } = require('../utils/transformer');

const BASE_URL = process.env.MEALDB_URL || 'https://www.themealdb.com/api/json/v1/1';

// cache en mémoire : on garde toutes les recettes 10 minutes
// pour ne pas refaire 26 appels à chaque requête
const DUREE_CACHE = 10 * 60 * 1000;
let cache = null;
let dateCache = 0;

async function appelerMealDB(chemin) {
  const reponse = await fetch(BASE_URL + chemin);

  if (!reponse.ok) {
    throw new Error('TheMealDB a répondu ' + reponse.status);
  }

  return reponse.json();
}

// TheMealDB n'a pas de route "toutes les recettes".
// La seule façon de tout avoir c'est de chercher lettre par lettre (search.php?f=a, f=b, ...)
async function getToutesLesRecettes() {
  const maintenant = Date.now();

  if (cache && maintenant - dateCache < DUREE_CACHE) {
    return cache;
  }

  const lettres = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const promesses = lettres.map((lettre) => appelerMealDB('/search.php?f=' + lettre));
  const resultats = await Promise.all(promesses);

  let recettes = [];
  for (const resultat of resultats) {
    // quand une lettre n'a aucune recette, meals vaut null
    if (Array.isArray(resultat.meals)) {
      recettes = recettes.concat(resultat.meals.map(transformerRecette));
    }
  }

  cache = recettes;
  dateCache = maintenant;

  return recettes;
}

async function getRecetteParId(id) {
  const data = await appelerMealDB('/lookup.php?i=' + encodeURIComponent(id));

  // id inconnu -> { "meals": null }
  if (!Array.isArray(data.meals) || data.meals.length === 0) {
    return null;
  }

  return transformerRecette(data.meals[0]);
}

async function getRecetteAuHasard() {
  const data = await appelerMealDB('/random.php');
  return transformerRecette(data.meals[0]);
}

module.exports = { getToutesLesRecettes, getRecetteParId, getRecetteAuHasard };
