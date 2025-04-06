const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  produits: [{
    produit_id: { type: mongoose.Schema.Types.ObjectId },
    quantite: { type: Number}
  }],
  client_id: { type: mongoose.Schema.Types.ObjectId },
  prix_total: { type: Number},
  statut: { 
    type: String, 
    enum: ["En attente", "Confirmée", "Expédiée"],
    default: "En attente"
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commande', commandeSchema);