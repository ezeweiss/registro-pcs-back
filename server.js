// server.js
const express = require('express');
const cors = require('cors');
const equiposRoutes = require('./routes/equiposRoutes');
const { connectToDb } = require('./datos/db.js');  // Importamos la función de conexión

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Llamamos a la función de conexión a la base de datos
connectToDb();

app.use(equiposRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
