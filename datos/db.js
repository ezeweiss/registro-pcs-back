const sql = require('mssql');
require('dotenv').config();

// Validación de variables de entorno
if (!process.env.DB_USER || !process.env.DB_SERVER || !process.env.DB_DATABASE) {
  console.error('Faltan variables de entorno: DB_USER, DB_SERVER o DB_DATABASE');
  process.exit(1);  // Detenemos la ejecución si faltan variables
}

const config = {
  user: process.env.DB_USER,  // Usuario de Windows
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER, // Nombre o IP del servidor
  database: process.env.DB_DATABASE, // Base de datos
  options: {
    encrypt: true, 
    trustServerCertificate: true, // Para evitar problemas de certificados si es necesario
  },
  authentication: {
    type: 'ntlm',  // Autenticación de Windows
    options: {
      domain: process.env.DB_DOMAIN || '', // Si no tienes dominio, dejar vacío
    },
  },
  connectionTimeout: 30000,  // Aumentamos el tiempo de espera a 30 segundos para la conexión
  requestTimeout: 30000,     // Aumentamos el tiempo de espera para las solicitudes a 30 segundos
};

console.log('DB_SERVER:', process.env.DB_SERVER);

// Conexión a la base de datos
const connectToDb = async () => {
  try {
    await sql.connect(config);
    console.log('Conexión a la base de datos exitosa!');
  } catch (err) {
    console.error('Error de conexión: ', err);
  }
};

module.exports = { connectToDb, sql };  // Exportamos la función de conexión y sql
