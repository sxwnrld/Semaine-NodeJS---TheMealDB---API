const test = require('node:test');
const assert = require('node:assert');

const { transformerRecette } = require('../src/utils/transformer');

// une recette comme TheMealDB la renvoie (raccourcie)
const meal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
  strIngredient1: 'soy sauce',
  strMeasure1: '3/4 cup',
  strIngredient2: 'water',
  strMeasure2: '1/2 cup',
  strIngredient3: 'brown sugar',
  strMeasure3: '1/4 cup',
  strIngredient4: '',
  strMeasure4: '',
  strIngredient5: null,
  strMeasure5: null,
  strIngredient6: ' ',
  strMeasure6: ' ',
};

test('les champs sont renommés', () => {
  const recette = transformerRecette(meal);

  assert.strictEqual(recette.id, '52772');
  assert.strictEqual(recette.nom, 'Teriyaki Chicken Casserole');
  assert.strictEqual(recette.categorie, 'Chicken');
  assert.strictEqual(recette.pays, 'Japanese');
  assert.strictEqual(recette.strMeal, undefined);
});

test('les ingrédients vides disparaissent', () => {
  const recette = transformerRecette(meal);

  assert.strictEqual(recette.ingredients.length, 3);
  assert.strictEqual(recette.nbIngredients, 3);
});

test('un ingrédient a un nom et une quantité', () => {
  const recette = transformerRecette(meal);

  assert.deepStrictEqual(recette.ingredients[0], { nom: 'soy sauce', quantite: '3/4 cup' });
});
