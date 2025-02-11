const sql = require('mssql');

// Función para ejecutar consultas SQL con parámetros
const executeQuery = async (query, parameters = []) => {
  let connection;
  try {
    // Abrir la conexión
    connection = await sql.connect();
    const result = await connection.request();

    // Añadir parámetros a la consulta si existen
    parameters.forEach(param => {
      result.input(param.name, param.type, param.value);
    });

    // Ejecutar la consulta
    const queryResult = await result.query(query);
    return queryResult.recordset;

  } catch (err) {
    throw new Error('Error al ejecutar la consulta: ' + err.message);
  } finally {
    // Cerrar la conexión
    if (connection) {
      await connection.close();
    }
  }
};

// Ruta para obtener todos los equipos
const getEquipos = async (req, res) => {
  try {
    const query = 'SELECT * FROM Equipos';
    const equipos = await executeQuery(query);
    res.json(equipos);
  } catch (err) {
    console.error('Error al obtener equipos:', err);
    res.status(500).send('Error al obtener equipos: ' + err.message);
  }
};

// Ruta para agregar un nuevo equipo
const addEquipo = async (req, res) => {
  const { ip, host, numeroSeriePC, numeroSerieMonitor, persona, marcaPC, direccion, sector } = req.body;

  // Validación básica de los datos
  if (!ip || !host || !numeroSeriePC || !numeroSerieMonitor || !persona || !marcaPC || !direccion || !sector) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  const query = `
    INSERT INTO Equipos (IP, Host, NumeroSeriePC, NumeroSerieMonitor, Persona, MarcaPC, Direccion, Sector)
    VALUES (@ip, @host, @numeroSeriePC, @numeroSerieMonitor, @persona, @marcaPC, @direccion, @sector)
  `;

  try {
    await executeQuery(query, [
      { name: 'ip', type: sql.NVarChar, value: ip },
      { name: 'host', type: sql.NVarChar, value: host },
      { name: 'numeroSeriePC', type: sql.NVarChar, value: numeroSeriePC },
      { name: 'numeroSerieMonitor', type: sql.NVarChar, value: numeroSerieMonitor },
      { name: 'persona', type: sql.NVarChar, value: persona },
      { name: 'marcaPC', type: sql.NVarChar, value: marcaPC },
      { name: 'direccion', type: sql.NVarChar, value: direccion },
      { name: 'sector', type: sql.NVarChar, value: sector }
    ]);
    res.status(201).send('Equipo agregado correctamente');
  } catch (err) {
    console.error('Error al agregar equipo:', err);
    res.status(500).send('Error al agregar equipo: ' + err.message);
  }
};

// Ruta para actualizar un equipo
const updateEquipo = async (req, res) => {
  const { id } = req.params;
  const { ip, host, numeroSeriePC, numeroSerieMonitor, persona, marcaPC, direccion, sector } = req.body;

  // Validación básica de los datos
  if (!ip || !host || !numeroSeriePC || !numeroSerieMonitor || !persona || !marcaPC || !direccion || !sector) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  const query = `
    UPDATE Equipos
    SET IP = @ip, Host = @host, NumeroSeriePC = @numeroSeriePC,
        NumeroSerieMonitor = @numeroSerieMonitor, Persona = @persona, MarcaPC = @marcaPC,
        Direccion = @direccion, Sector = @sector
    WHERE ID = @id
  `;

  try {
    await executeQuery(query, [
      { name: 'id', type: sql.Int, value: id },
      { name: 'ip', type: sql.NVarChar, value: ip },
      { name: 'host', type: sql.NVarChar, value: host },
      { name: 'numeroSeriePC', type: sql.NVarChar, value: numeroSeriePC },
      { name: 'numeroSerieMonitor', type: sql.NVarChar, value: numeroSerieMonitor },
      { name: 'persona', type: sql.NVarChar, value: persona },
      { name: 'marcaPC', type: sql.NVarChar, value: marcaPC },
      { name: 'direccion', type: sql.NVarChar, value: direccion },
      { name: 'sector', type: sql.NVarChar, value: sector }
    ]);
    res.send('Equipo actualizado correctamente');
  } catch (err) {
    console.error('Error al actualizar equipo:', err);
    res.status(500).send('Error al actualizar equipo: ' + err.message);
  }
};

// Ruta para eliminar un equipo
const deleteEquipo = async (req, res) => {
  const { id } = req.params;

  // Validación del ID
  if (!id) {
    return res.status(400).send('El ID del equipo es obligatorio');
  }

  const query = 'DELETE FROM Equipos WHERE ID = @id';

  try {
    await executeQuery(query, [
      { name: 'id', type: sql.Int, value: id }
    ]);
    res.send('Equipo eliminado correctamente');
  } catch (err) {
    console.error('Error al eliminar equipo:', err);
    res.status(500).send('Error al eliminar equipo: ' + err.message);
  }
};

// Exportar las funciones para ser usadas en las rutas
module.exports = {
  getEquipos,
  addEquipo,
  updateEquipo,
  deleteEquipo
};
