const express = require("express");
const cors = require("cors");
const equiposRoutes = require("./routes/equipos");
const direccionesRoutes = require("./routes/direcciones");
const marcasRoutes = require("./routes/marcas");
const switchesRoutes = require("./routes/switches");
const telefonosRoutes = require("./routes/telefonos");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/equipos", equiposRoutes);
app.use("/direcciones", direccionesRoutes);
app.use("/marcas", marcasRoutes); 
app.use("/switches", switchesRoutes);
app.use("/telefonos", telefonosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
