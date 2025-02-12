const express = require("express");
const cors = require("cors");
const equiposRoutes = require("./routes/equipos");
const direccionesRoutes = require("./routes/direcciones");
const marcasRoutes = require("./routes/marcas");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/equipos", equiposRoutes);
app.use("/direcciones", direccionesRoutes);
app.use("/marcas", marcasRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
