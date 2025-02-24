const express = require('express');
const Equipo = require('../models/Equipo');
const Direccion = require('../models/Direccion');
const Marca = require('../models/Marca');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        {
          model: Direccion,
          as: 'direccion',
          attributes: ['id', 'direccion']
        },
        {
          model: Marca,
          as: 'marca',
          attributes: ['id', 'marca']
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

router.post('/', async (req, res) => {
  try {
    const { ip, host, id_dir, id_marca, seriePc, serieMonitor, usuario, sector } = req.body;

    const direccionExist = await Direccion.findByPk(id_dir);
    if (!direccionExist) {
      return res.status(400).json({ message: "La dirección con ese ID no existe" });
    }

    const marcaExist = await Marca.findByPk(id_marca);
    if (!marcaExist) {
      return res.status(400).json({ message: "La marca con ese ID no existe" });
    }

    const ipExist = await Equipo.findOne({ where: { ip } });
    if (ipExist) {
      return res.status(400).json({ field: "ip", message: "La dirección IP ya está en uso" });
    }

    const hostExist = await Equipo.findOne({ where: { host } });
    if (hostExist) {
      return res.status(400).json({ field: "host", message: "El nombre de host ya está en uso" });
    }

    const nuevoEquipo = await Equipo.create({
      ip,
      host,
      seriePc,
      serieMonitor,
      usuario,
      sector,
      id_dir,
      id_marca
    });

    res.status(201).json(nuevoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


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


router.put('/:id', async (req, res) => {
  try {
    const equipoExist = await Equipo.findByPk(req.params.id);
    if (!equipoExist) {
      return res.status(400).send("El equipo no existe");
    }

    const direccionExist = await Direccion.findByPk(req.body.id_dir);
    const marcaExist = await Marca.findByPk(req.body.id_marca);

    if (!direccionExist || !marcaExist) {
      return res.status(400).send("La dirección o la marca no existen");
    }

    const equipoActualizado = await equipoExist.update({
      ip: req.body.ip,
      host: req.body.host,
      seriePc: req.body.seriePc,
      serieMonitor: req.body.serieMonitor,
      usuario: req.body.usuario,
      sector: req.body.sector,
      id_dir: req.body.id_dir,
      id_marca: req.body.id_marca
    });

    res.json(equipoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el equipo");
  }
});


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



router.get('/ip-no-usadas', async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      attributes: ['ip'],
    });
    
    const ipsUsadas = equipos.map(equipo => equipo.ip);
    
    const startIp = "10.0.14.1";
    const endIp = "10.0.14.255";

    const generarIpsDisponibles = (ipsUsadas) => {
      const allIps = [];
      let start = startIp.split('.').map(Number);
      let end = endIp.split('.').map(Number);

      for (let i = start[3]; i <= end[3]; i++) {
        const ip = `${start[0]}.${start[1]}.${start[2]}.${i}`;
        if (!ipsUsadas.includes(ip)) {
          allIps.push(ip);
        }
      }

      return allIps;
    };

    const ipsNoUsadas = generarIpsDisponibles(ipsUsadas);
    
    res.json(ipsNoUsadas);
  } catch (error) {
    console.error("Error al obtener las IPs no usadas:", error);
    res.status(500).send('Error al obtener las IPs no usadas');
  }
});


module.exports = router;
