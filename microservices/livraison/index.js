const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Livraison = require('./models/Livraison');
const app = express();

app.use(express.json());


app.post('/livraison/ajouter', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3002/commande/${req.body.commande_id}`);
    if (!response.data) {
      return res.status(404).send({ error: 'Commande non trouvée' });
    }

    const livraison = new Livraison(req.body);
    await livraison.save();
    res.status(201).send(livraison);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/livraison/:id', async (req, res) => {
    try {
      const livraison = await Livraison.findByIdAndUpdate(
        req.params.id,
        { statut: req.body.statut },
        { new: true }
      );
      if (!livraison) return res.status(404).send();
      res.send(livraison);
    } catch (error) {
      res.status(400).send(error);
    }
  });

mongoose.connect('mongodb://localhost:27017/livraisonDB')
  .then(() => {
    app.listen(3003, () => console.log('Microservice Livraison démarré sur le port 3003'));
  })
  .catch(err => console.error(err));