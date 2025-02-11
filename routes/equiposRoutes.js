// routes/equiposRoutes.js
const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');


// Definir las rutas para equipos
router.get('/equipos', equiposController.getEquipos);
router.post('/equipos', equiposController.addEquipo);
router.put('/equipos/:id', equiposController.updateEquipo);
router.delete('/equipos/:id', equiposController.deleteEquipo);

module.exports = router;
