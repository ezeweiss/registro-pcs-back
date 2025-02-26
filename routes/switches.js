const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Switch = require("../models/switch"); // Asegúrate de que tienes el modelo creado
const Configuracion = require("../models/configuracion"); // Asegúrate de que tienes el modelo creado

// Obtener todos los switches
router.get("/", async (req, res) => {
  try {
    const switches = await Switch.findAll();
    res.json(switches);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener switches", detalle: error.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { clave } = req.query;  // La clave se pasa como parámetro de consulta
  
      // Buscar el switch por ID, incluyendo la clave desde la tabla Configuracion
      const switchData = await Switch.findByPk(id, {
        include: {
          model: Configuracion,
          as: 'configuracion',
          attributes: ['clave_predeterminada'], // Solo traer la clave de la configuración
        },
      });
  
      if (!switchData) {
        return res.status(404).json({ error: "Switch no encontrado" });
      }
  
     // Verificar la clave
    const claveDB = switchData.configuracion.clave_predeterminada; // Alias correcto
    let isClaveCorrect = false;

    if (claveDB.startsWith("$2b$")) {
      // Si la clave en BD está encriptada, usar bcrypt
      isClaveCorrect = await bcrypt.compare(clave, claveDB);
    } else {
      // Si no está encriptada, comparar directamente
      isClaveCorrect = clave === claveDB;
    }

    if (!isClaveCorrect) {
      return res.status(403).json({ error: "Clave incorrecta" });
    }

  
      // Si la clave es correcta, devolver los datos del switch incluyendo usuario y clave
      const switchWithCredentials = {
        mac: switchData.mac,
        ip: switchData.ip,
        subred: switchData.subred,
        usuario: switchData.usuario,
        clave: switchData.clave,  // Mostrar la clave solo si la clave es correcta
        sector: switchData.sector,
        marca: switchData.marca,
      };
  
      res.json(switchWithCredentials);
  
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el switch", detalle: error.message });
    }
  });

// Crear un nuevo switch
router.post("/", async (req, res) => {
  try {
    const nuevoSwitch = await Switch.create(req.body);
    res.status(201).json(nuevoSwitch);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el switch", detalle: error.message });
  }
});

// Actualizar un switch
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const switchExistente = await Switch.findByPk(id);

    if (!switchExistente) {
      return res.status(404).json({ error: "Switch no encontrado" });
    }

    await switchExistente.update(req.body);
    res.json({ mensaje: "Switch actualizado correctamente", switch: switchExistente });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el switch", detalle: error.message });
  }
});

// Eliminar un switch
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const switchExistente = await Switch.findByPk(id);

    if (!switchExistente) {
      return res.status(404).json({ error: "Switch no encontrado" });
    }

    await switchExistente.destroy();
    res.json({ mensaje: "Switch eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el switch", detalle: error.message });
  }
});

module.exports = router;
