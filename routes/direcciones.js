const express = require('express');
const Direccion = require('../models/Direccion');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      console.log('Recibiendo solicitud para obtener direcciones');
      const direcciones = await Direccion.findAll();
      console.log("Direcciones obtenidas:", direcciones); 
      res.json(direcciones);
    } catch (error) {
      console.error("Error al obtener direcciones:", error);
      res.status(500).send('Error al obtener direcciones');
    }
});

  

  module.exports = router;
