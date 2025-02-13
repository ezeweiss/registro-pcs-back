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
// Ruta para agregar un nuevo equipo
router.post('/', async (req, res) => {
  try {
    // Validamos si la dirección existe
    const direccionExist = await Direccion.findByPk(req.body.id_dir);
    if (!direccionExist) {
      return res.status(400).send("La dirección con ese ID no existe");
    }

    // Validamos si la marca existe
    const marcaExist = await Marca.findByPk(req.body.id_marca);
    if (!marcaExist) {
      return res.status(400).send("La marca con ese ID no existe");
    }

    // Creamos el nuevo equipo con los datos proporcionados
    const nuevoEquipo = await Equipo.create({
      ip: req.body.ip,
      host: req.body.host,
      seriePc: req.body.seriePc,
      serieMonitor: req.body.serieMonitor,
      usuario: req.body.usuario,
      sector: req.body.sector,
      id_dir: req.body.id_dir, // ID de la dirección
      id_marca: req.body.id_marca // ID de la marca
    });

    // Devolvemos el nuevo equipo en la respuesta
    res.json(nuevoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar equipo');
  }
});


// Ruta para obtener un equipo por su ID
router.get('/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findByPk(req.params.id);
    if (!equipo) return res.status(404).send('Equipo no encontrado');
    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener equipo');
  }
});


// Actualizar un equipo
// En el backend, en tu archivo de rutas (por ejemplo, equipos.js)
router.put('/:id', async (req, res) => {
  try {
    // Verifica si el equipo existe
    const equipoExist = await Equipo.findByPk(req.params.id);
    if (!equipoExist) {
      return res.status(400).send("El equipo no existe");
    }

    // Verifica si la dirección y la marca existen
    const direccionExist = await Direccion.findByPk(req.body.id_dir);
    const marcaExist = await Marca.findByPk(req.body.id_marca);

    if (!direccionExist || !marcaExist) {
      return res.status(400).send("La dirección o la marca no existen");
    }

    // Actualiza el equipo
    const equipoActualizado = await equipoExist.update({
      ip: req.body.ip,
      host: req.body.host,
      seriePc: req.body.seriePc,
      serieMonitor: req.body.serieMonitor,
      usuario: req.body.usuario,
      sector: req.body.sector,
      id_dir: req.body.id_dir,  // ID de la dirección
      id_marca: req.body.id_marca // ID de la marca
    });

    // Devuelve el equipo actualizado
    res.json(equipoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el equipo");
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
