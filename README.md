# API Recettes (TheMealDB)

Projet individuel de la semaine NodeJS ,transposé sur [TheMealDB](https://www.themealdb.com/api.php).

L'API va chercher les recettes sur TheMealDB, les transforme dans un format plus propre (champs renommés en français, ingrédients dans un vrai tableau) et ajoute des choses que TheMealDB ne donne pas : pagination, filtres combinables, statistiques.

## Installation

```bash
npm install
cp .env.example .env
npm start
```

Le serveur tourne sur http://localhost:3000. La page d'accueil est un mini front a l'aide de l'IA qui permet de tester l'API .

Autres commandes :

- `npm run dev` : relance le serveur à chaque modification
- `npm test` : lance les tests

Pas de clé d'API à demander, TheMealDB est en accès libre .

## Structure

```
server.js                 lance le serveur
src/
  app.js                  configuration d'Express et branchement des routes
  routes/                 les URLs
  controllers/            ce que fait chaque route
  services/               les appels à TheMealDB + le cache
  utils/transformer.js    la transformation d'une recette
public/                   le front de test
tests/                    tests de la transformation
```

## Routes

| Route | Ce qu'elle fait |
|---|---|
| `GET /api/recettes` | Liste des recettes transformées, paginée (`page`, `limit`) |
| `GET /api/recettes/:id` | Une recette, 404 si l'id n'existe pas |
| `GET /api/recettes/recherche` | Filtres en query : `categorie`, `pays`, `nom` (combinables) |
| `GET /api/stats` | Statistiques calculées sur toutes les recettes |
| `GET /api/categories` | Les catégories avec le nombre de recettes dans chacune |
| `GET /api/recettes/hasard` | Une recette au hasard |


### Codes d'erreur

- `400` : paramètre invalide (`page=0`, `limit=abc`) ou recherche sans aucun filtre
- `404` : recette inconnue ou route qui n'existe pas
- `500` : TheMealDB ne répond pas

## Choix techniques

**L'ordre des routes.** `/recherche` et `/hasard` sont déclarées avant `/:id`, sinon Express prend le mot "recherche" pour un id.

## Limites

- Les noms de catégories et de pays restent en anglais (ce sont ceux de TheMealDB).
- Le filtre sur `categorie` et `pays` doit être le mot exact .
- La recherche n'est pas paginée.
