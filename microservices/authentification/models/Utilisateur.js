const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String },
  email: { 
    type: String, 
  },
  mot_de_passe: { type: String },
  created_at: { type: Date, default: Date.now }
});

utilisateurSchema.pre('save', async function(next) {
  if (this.isModified('mot_de_passe')) {
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, 8);
  }
  next();
});

utilisateurSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '1h'
  });
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);