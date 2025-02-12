const express = require('express');
const Equipo = require('../models/Equipo');
const Direccion = require('../models/Direccion');
const Marca = require('../models/Marca');
const router = express.Router();

// Obtener todos los equipos con las direcciones y marcas
router.get('/', async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        {
          model: Direccion,
          as: 'direccion', // Aquí se usa el alias definido en el modelo
          attributes: ['id', 'direccion']  // Selecciona las columnas necesarias de Direccion
        },
        {
          model: Marca,
          as: 'marca', // Aquí se usa el alias definido en el modelo
          attributes: ['id', 'marca']  // Selecciona las columnas necesarias de Marca
        }
      ],
      logging: console.log
    });

    console.log('Equipos con direcciones y marcas:', JSON.stringify(equipos, null, 2));

    res.json(equipos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener equipos');
  }
});

// Agregar un nuevo equipo con direccion y marca
router.post('/', async (req, res) => {
  try {
    const nuevoEquipo = await Equipo.create(req.body);
    res.json(nuevoEquipo);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al agregar equipo');
  }
});

// Actualizar un equipo
router.put('/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findByPk(req.params.id);
    if (!equipo) return res.status(404).send('Equipo no encontrado');
    
    await equipo.update(req.body);
    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al actualizar equipo');
  }
});

// Eliminar un equipo
router.delete('/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findByPk(req.params.id);
    if (!equipo) return res.status(404).send('Equipo no encontrado');
    
    await equipo.destroy();
    res.send('Equipo eliminado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar equipo');
  }
});

module.exports = router;
