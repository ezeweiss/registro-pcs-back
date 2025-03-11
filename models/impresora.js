const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");

const Impresora = sequelize.define("Impresoras", {
    ip: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    sector: { type: DataTypes.STRING, allowNull: false },
    mac: { type: DataTypes.STRING, allowNull: true },
    numeroSerie: { type: DataTypes.STRING, allowNull: true },
}, {
    schema: 'Equipos',
    tableName: 'Impresoras',
    timestamps: false,
});

sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
}).catch(err => {
    console.error('Error al sincronizar base de datos:', err);
});

module.exports = Impresora;
