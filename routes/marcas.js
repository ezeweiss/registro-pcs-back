const express = require('express');
const Marca = require('../models/Marca');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const marcas = await Marca.findAll();
      res.json(marcas);
    } catch (error) {
      console.error("Error al obtener marcas", error);
      res.status(500).send('Error al obtener marcas');
    }
  });

module.exports = router;