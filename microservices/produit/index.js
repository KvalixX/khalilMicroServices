const express = require('express');
const mongoose = require('mongoose');
const Produit = require('./models/Produit');
const app = express();


app.use(express.json());


app.post('/produit/ajouter', async (req, res) => {
  try {
    const produit = new Produit(req.body);
    await produit.save();
    res.status(201).send(produit);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/produit/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).send();
    res.send(produit);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/produit/:id/stock', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true }
    );
    if (!produit) return res.status(404).send();
    res.send(produit);
  } catch (error) {
    res.status(400).send(error);
  }
});

mongoose.connect('mongodb://localhost:27017/produitDB')
  .then(() => {
    app.listen(3001, () => console.log('Microservice Produit démarré sur le port 3001'));
  })
  .catch(err => console.error(err));