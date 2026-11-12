const express = require('express');
const path = require('path');

const recettesRoutes = require('./routes/recettes.routes');
const categoriesRoutes = require('./routes/categories.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();

app.use(express.json());

// le petit front de test (public/index.html)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/recettes', recettesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stats', statsRoutes);

// si aucune route au-dessus n'a répondu
app.use((req, res) => {
  res.status(404).json({ erreur: 'Route introuvable' });
});

module.exports = app;
