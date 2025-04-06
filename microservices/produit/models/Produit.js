const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String},
  description: { type: String},
  prix: { type: Number},
  stock: { type: Number},
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produit', produitSchema);