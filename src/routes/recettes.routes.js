const express = require('express');
const controller = require('../controllers/recettes.controller');

const router = express.Router();

router.get('/', controller.listerRecettes);

// attention à l'ordre : /recherche et /hasard doivent être AVANT /:id
// sinon Express croit que "recherche" est un id
router.get('/recherche', controller.rechercherRecettes);
router.get('/hasard', controller.recetteAuHasard);

router.get('/:id', controller.getRecette);

module.exports = router;
