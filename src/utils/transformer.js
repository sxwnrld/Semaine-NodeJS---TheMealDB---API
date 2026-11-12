// TheMealDB renvoie strIngredient1 ... strIngredient20 et strMeasure1 ... strMeasure20
// On en fait un vrai tableau, sans les cases vides
function extraireIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const nom = meal['strIngredient' + i];
    const quantite = meal['strMeasure' + i];

    // selon les recettes le champ vide vaut "", " " ou null
    if (nom && nom.trim() !== '') {
      ingredients.push({
        nom: nom.trim(),
        quantite: quantite ? quantite.trim() : '',
      });
    }
  }

  return ingredients;
}

function transformerRecette(meal) {
  const ingredients = extraireIngredients(meal);

  return {
    id: meal.idMeal,
    nom: meal.strMeal,
    categorie: meal.strCategory,
    pays: meal.strArea,
    image: meal.strMealThumb,
    ingredients: ingredients,
    nbIngredients: ingredients.length,
  };
}

module.exports = { transformerRecette, extraireIngredients };
