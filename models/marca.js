const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");

const Marca = sequelize.define("MarcasPC", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  marca: { type: DataTypes.STRING, allowNull: false }
}, {
  schema: 'Equipos',
  tableName: 'MarcasPC',
  timestamps: false
});

module.exports = Marca;
