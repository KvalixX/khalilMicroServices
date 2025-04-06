const express = require('express');
const mongoose = require('mongoose');
const Utilisateur = require('./models/Utilisateur');
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


app.use(express.json());



const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      const utilisateur = await Utilisateur.findOne({ _id: decoded._id });
  
      if (!utilisateur) {
        throw new Error();
      }
  
      req.utilisateur = utilisateur;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Authentification requise' });
    }
};
  
  
app.post('/auth/register', async (req, res) => {
    try {
      const utilisateur = new Utilisateur(req.body);
      await utilisateur.save();
      const token = utilisateur.generateAuthToken();
      res.status(201).send({ utilisateur, token });
    } catch (error) {
      res.status(400).send(error);
    }
});
  
app.post('/auth/login', async (req, res) => {
    try {
      const utilisateur = await Utilisateur.findOne({ email: req.body.email });
      if (!utilisateur) {
        return res.status(401).send({ error: 'Identifiants invalides' });
      }
  
      const isMatch = await bcrypt.compare(req.body.mot_de_passe, utilisateur.mot_de_passe);
      if (!isMatch) {
        return res.status(401).send({ error: 'Identifiants invalides' });
      }
  
      const token = utilisateur.generateAuthToken();
      res.send({ utilisateur, token });
    } catch (error) {
      res.status(400).send(error);
    }
});
  
app.get('/auth/profil', auth, async (req, res) => {
    res.send(req.utilisateur);
});
 
mongoose.connect('mongodb://localhost:27017/authDB')
  .then(() => {
    app.listen(3004, () => console.log('Microservice Authentification démarré sur le port 3004'));
  })
  .catch(err => console.error(err));