const mealdb = require('../services/mealdb.service');

// GET /api/stats
// rien de tout ça n'existe dans TheMealDB, tout est calculé ici
async function getStats(req, res) {
  try {
    const recettes = await mealdb.getToutesLesRecettes();

    if (recettes.length === 0) {
      return res.json({ totalRecettes: 0 });
    }

    let totalIngredients = 0;
    let plusComplexe = recettes[0];
    let plusSimple = recettes[0];
    const parPays = {};
    const compteurIngredients = {};

    for (const recette of recettes) {
      totalIngredients += recette.nbIngredients;

      if (recette.nbIngredients > plusComplexe.nbIngredients) {
        plusComplexe = recette;
      }
      if (recette.nbIngredients < plusSimple.nbIngredients) {
        plusSimple = recette;
      }

      parPays[recette.pays] = (parPays[recette.pays] || 0) + 1;

      for (const ingredient of recette.ingredients) {
        // "Salt" et "salt" doivent compter pour le même ingrédient
        const nom = ingredient.nom.toLowerCase();
        compteurIngredients[nom] = (compteurIngredients[nom] || 0) + 1;
      }
    }

    const moyenne = totalIngredients / recettes.length;

    const top5Ingredients = Object.keys(compteurIngredients)
      .map((nom) => ({ nom: nom, nbRecettes: compteurIngredients[nom] }))
      .sort((a, b) => b.nbRecettes - a.nbRecettes)
      .slice(0, 5);

    res.json({
      totalRecettes: recettes.length,
      nbPays: Object.keys(parPays).length,
      moyenneIngredients: Math.round(moyenne * 10) / 10,
      recetteLaPlusComplexe: {
        id: plusComplexe.id,
        nom: plusComplexe.nom,
        nbIngredients: plusComplexe.nbIngredients,
      },
      recetteLaPlusSimple: {
        id: plusSimple.id,
        nom: plusSimple.nom,
        nbIngredients: plusSimple.nbIngredients,
      },
      top5Ingredients: top5Ingredients,
      recettesParPays: parPays,
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Impossible de calculer les statistiques' });
  }
}

module.exports = { getStats };
