const mealdb = require('../services/mealdb.service');

// GET /api/categories
// chaque catégorie avec le nombre de recettes dedans
async function listerCategories(req, res) {
  try {
    const recettes = await mealdb.getToutesLesRecettes();

    const compteur = {};
    for (const recette of recettes) {
      if (compteur[recette.categorie]) {
        compteur[recette.categorie]++;
      } else {
        compteur[recette.categorie] = 1;
      }
    }

    const categories = Object.keys(compteur).map((nom) => {
      return { nom: nom, nbRecettes: compteur[nom] };
    });

    // de la plus grosse à la plus petite
    categories.sort((a, b) => b.nbRecettes - a.nbRecettes);

    res.json({ total: categories.length, categories: categories });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Impossible de récupérer les catégories' });
  }
}

module.exports = { listerCategories };
