const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");
const Configuracion = require("./configuracion");


const Switch = sequelize.define("Switchs", {
    mac: { type: DataTypes.STRING, allowNull: false },
    ip: { type: DataTypes.STRING, allowNull: false },
    subred: { type: DataTypes.STRING, allowNull: false, unique: true },
    usuario: { type: DataTypes.STRING, allowNull: true },
    clave: { type: DataTypes.STRING, allowNull: true },
    sector: { type: DataTypes.STRING, allowNull: true },
    marca: { type: DataTypes.STRING, allowNull: true},
    id_config: { 
        type: DataTypes.INTEGER,
        references: {
            model: 'Configuraciones',
            key: 'id',
        },
        allowNull: true,
        },
    
  },{
    schema: 'Equipos',
    timestamps: false,
  }
    
  );

  Switch.belongsTo(Configuracion, { foreignKey: 'id_config', as: 'configuracion' });
  // Relación entre Switch y Configuracion
sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
  }).catch(err => {
    console.error('Error al sincronizar base de datos:', err);
  });

module.exports = Switch;
