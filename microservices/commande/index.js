const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Commande = require('./models/Commande');
const app = express();


app.use(express.json());


app.post('/commande/ajouter', async (req, res) => {
  try {
    let prixTotal = 0;
    for (const item of req.body.produits) {
      const response = await axios.get(`http://localhost:3001/produit/${item.produit_id}`);
      const produit = response.data;
      
      if (produit.stock < item.quantite) {
        return res.status(400).send({ error: `Stock insuffisant pour le produit ${produit.nom}` });
      }
      
      prixTotal += produit.prix * item.quantite;
    }

    const commande = new Commande({
      ...req.body,
      prix_total: prixTotal
    });

    await commande.save();

    for (const item of req.body.produits) {
      await axios.patch(`http://localhost:3001/produit/${item.produit_id}/stock`, {
        stock: -item.quantite
      });
    }

    res.status(201).send(commande);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/commande/:id', async (req, res) => {
    try {
      const commande = await Commande.findById(req.params.id);
      if (!commande) return res.status(404).send();
      res.send(commande);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
app.patch('/commande/:id/statut', async (req, res) => {
    try {
      const commande = await Commande.findByIdAndUpdate(
        req.params.id,
        { statut: req.body.statut },
        { new: true }
      );
      if (!commande) return res.status(404).send();
      res.send(commande);
    } catch (error) {
      res.status(400).send(error);
    }
});
  

mongoose.connect('mongodb://localhost:27017/commandeDB')
  .then(() => {
    app.listen(3002, () => console.log('Microservice Commande démarré sur le port 3002'));
  })
  .catch(err => console.error(err));