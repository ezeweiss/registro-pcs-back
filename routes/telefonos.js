const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Telefono = require("../models/telefono");
const Configuracion = require("../models/configuracion");

// Obtener todos los teléfonos
router.get("/", async (req, res) => {
  try {
    const telefonos = await Telefono.findAll();
    res.json(telefonos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener teléfonos", detalle: error.message });
  }
});

// Obtener un teléfono por ID con validación de clave
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { clave } = req.query;

    const telefonoData = await Telefono.findByPk(id, {
      include: {
        model: Configuracion,
        as: 'configuracion',
        attributes: ['clave_predeterminada'],
      },
    });

    if (!telefonoData) {
      return res.status(404).json({ error: "Teléfono no encontrado" });
    }

    const claveDB = telefonoData.configuracion.clave_predeterminada;
    let isClaveCorrect = false;

    if (claveDB.startsWith("$2b$")) {
      isClaveCorrect = await bcrypt.compare(clave, claveDB);
    } else {
      isClaveCorrect = clave === claveDB;
    }

    if (!isClaveCorrect) {
      return res.status(403).json({ error: "Clave incorrecta" });
    }

    const telefonoWithCredentials = {
      ip: telefonoData.ip,
      interno: telefonoData.interno,
      usuario: telefonoData.usuario,
      clave: telefonoData.clave,
      sipUser: telefonoData.sipUser,
      sipPassword: telefonoData.sipPassword,
      sector: telefonoData.sector,
      numeroSerie: telefonoData.numeroSerie,
      mac: telefonoData.mac,
    };

    res.json(telefonoWithCredentials);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el teléfono", detalle: error.message });
  }
});

// Crear un nuevo teléfono
router.post("/", async (req, res) => {
  try {
    const nuevoTelefono = await Telefono.create(req.body);
    res.status(201).json(nuevoTelefono);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el teléfono", detalle: error.message });
  }
});

// Actualizar un teléfono
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const telefonoExistente = await Telefono.findByPk(id);

    if (!telefonoExistente) {
      return res.status(404).json({ error: "Teléfono no encontrado" });
    }

    await telefonoExistente.update(req.body);
    res.json({ mensaje: "Teléfono actualizado correctamente", telefono: telefonoExistente });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el teléfono", detalle: error.message });
  }
});

// Eliminar un teléfono
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const telefonoExistente = await Telefono.findByPk(id);

    if (!telefonoExistente) {
      return res.status(404).json({ error: "Teléfono no encontrado" });
    }

    await telefonoExistente.destroy();
    res.json({ mensaje: "Teléfono eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el teléfono", detalle: error.message });
  }
});

module.exports = router;
