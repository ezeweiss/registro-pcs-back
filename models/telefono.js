const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");
const Configuracion = require("./configuracion");

const Telefono = sequelize.define("Telefonos", {
    ip: { type: DataTypes.STRING, allowNull: false },
    interno: { type: DataTypes.STRING, allowNull: false },
    usuario: { type: DataTypes.STRING, allowNull: true },
    clave: { type: DataTypes.STRING, allowNull: true },
    sipUser: { type: DataTypes.STRING, allowNull: true },
    sipPassword: { type: DataTypes.STRING, allowNull: true },
    sector: { type: DataTypes.STRING, allowNull: true },
    numeroSerie: { type: DataTypes.STRING, allowNull: true },
    mac: { type: DataTypes.STRING, allowNull: false },
    id_config: { 
        type: DataTypes.INTEGER,
        references: {
            model: 'Configuraciones',
            key: 'id',
        },
        allowNull: true,
    },
}, {
    schema: 'Equipos',
    timestamps: false,
});

Telefono.belongsTo(Configuracion, { foreignKey: 'id_config', as: 'configuracion' });

sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
}).catch(err => {
    console.error('Error al sincronizar base de datos:', err);
});

module.exports = Telefono;
