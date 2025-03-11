const express = require("express");
const router = express.Router();
const Impresora = require("../models/impresora"); // Asegúrate de que el modelo está creado

// Obtener todas las impresoras
router.get("/", async (req, res) => {
  try {
    const impresoras = await Impresora.findAll();
    res.json(impresoras);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener impresoras", detalle: error.message });
  }
});

// Obtener una impresora por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const impresora = await Impresora.findByPk(id);

    if (!impresora) {
      return res.status(404).json({ error: "Impresora no encontrada" });
    }

    res.json(impresora);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la impresora", detalle: error.message });
  }
});

// Crear una nueva impresora
router.post("/", async (req, res) => {
  try {
    const nuevaImpresora = await Impresora.create(req.body);
    res.status(201).json(nuevaImpresora);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la impresora", detalle: error.message });
  }
});

// Actualizar una impresora
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const impresoraExistente = await Impresora.findByPk(id);

    if (!impresoraExistente) {
      return res.status(404).json({ error: "Impresora no encontrada" });
    }

    await impresoraExistente.update(req.body);
    res.json({ mensaje: "Impresora actualizada correctamente", impresora: impresoraExistente });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar la impresora", detalle: error.message });
  }
});

// Eliminar una impresora
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const impresoraExistente = await Impresora.findByPk(id);

    if (!impresoraExistente) {
      return res.status(404).json({ error: "Impresora no encontrada" });
    }

    await impresoraExistente.destroy();
    res.json({ mensaje: "Impresora eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la impresora", detalle: error.message });
  }
});

module.exports = router;
