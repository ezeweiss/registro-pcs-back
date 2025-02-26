const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");
const Switch = require("./switch");



const Configuracion = sequelize.define('Configuraciones', {
    clave_predeterminada: { type: DataTypes.STRING, allowNull: false },

}, {
    schema: 'Equipos',
    tableName: 'Configuraciones',
    timestamps: false,
});

// Configuracion.hasMany(Switch, { foreignKey: 'id_config', as: 'switches' });
sequelize.sync({ force: false })  // Forzar la sincronización si es necesario
  .then(() => {
    console.log("Modelos sincronizados correctamente con la base de datos.");
  })
  .catch((error) => {
    console.error("Error al sincronizar los modelos con la base de datos:", error);
  });

module.exports = Configuracion;

