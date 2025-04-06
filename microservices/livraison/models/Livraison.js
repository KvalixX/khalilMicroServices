const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  commande_id: { type: mongoose.Schema.Types.ObjectId },
  transporteur_id: { type: mongoose.Schema.Types.ObjectId },
  statut: { 
    type: String,  
    enum: ["En attente", "En cours", "Livrée"],
    default: "En attente"
  },
  adresse_livraison: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Livraison', livraisonSchema);