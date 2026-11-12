const mealdb = require('../services/mealdb.service');

// GET /api/recettes?page=1&limit=10
async function listerRecettes(req, res) {
  try {
    // valeurs par défaut si rien n'est donné dans l'URL
    const page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ erreur: 'page et limit doivent être des nombres supérieurs à 0' });
    }
    if (limit > 50) {
      limit = 50;
    }

    const recettes = await mealdb.getToutesLesRecettes();

    const debut = (page - 1) * limit;
    const fin = debut + limit;

    res.json({
      page: page,
      limit: limit,
      total: recettes.length,
      totalPages: Math.ceil(recettes.length / limit),
      recettes: recettes.slice(debut, fin),
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Impossible de récupérer les recettes' });
  }
}

// GET /api/recettes/recherche?categorie=Chicken&pays=Japanese&nom=teriyaki
// les filtres peuvent se combiner
async function rechercherRecettes(req, res) {
  try {
    const { categorie, pays, nom } = req.query;

    if (!categorie && !pays && !nom) {
      return res.status(400).json({
        erreur: 'Il faut au moins un filtre : categorie, pays ou nom',
      });
    }

    let recettes = await mealdb.getToutesLesRecettes();

    if (categorie) {
      recettes = recettes.filter((r) => r.categorie && r.categorie.toLowerCase() === categorie.toLowerCase());
    }
    if (pays) {
      recettes = recettes.filter((r) => r.pays && r.pays.toLowerCase() === pays.toLowerCase());
    }
    if (nom) {
      recettes = recettes.filter((r) => r.nom.toLowerCase().includes(nom.toLowerCase()));
    }

    res.json({
      filtres: { categorie, pays, nom },
      total: recettes.length,
      recettes: recettes,
    });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Impossible de faire la recherche' });
  }
}

// GET /api/recettes/hasard
async function recetteAuHasard(req, res) {
  try {
    const recette = await mealdb.getRecetteAuHasard();
    res.json(recette);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Impossible de récupérer une recette au hasard' });
  }
}

// GET /api/recettes/:id
async function getRecette(req, res) {
  try {
    const recette = await mealdb.getRecetteParId(req.params.id);

    if (!recette) {
      return res.status(404).json({ erreur: `Aucune recette avec l'id ${req.params.id}` });
    }

    res.json(recette);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Impossible de récupérer la recette' });
  }
}

module.exports = { listerRecettes, rechercherRecettes, recetteAuHasard, getRecette };
