const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");

const Direccion = sequelize.define("Direcciones", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  direccion: { type: DataTypes.STRING, allowNull: false }
}, {
  schema: 'Equipos', // Ajusta al esquema de tu base de datos
  tableName: 'Direcciones',
  timestamps: false
});

module.exports = Direccion;
