const { DataTypes } = require("sequelize");
const sequelize = require("../datos/db");
const Direccion = require("./direccion");
const Marca = require("./marca");

const Equipo = sequelize.define("Computadoras", {
  ip: { type: DataTypes.STRING, allowNull: false },
  host: { type: DataTypes.STRING, allowNull: false },
  seriePc: { type: DataTypes.STRING, allowNull: false, unique: true },
  serieMonitor: { type: DataTypes.STRING, allowNull: true },
  usuario: { type: DataTypes.STRING, allowNull: true },
  sector: { type: DataTypes.STRING, allowNull: true },
  id_dir: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Direccion', // Nombre de la tabla en la base de datos
      key: 'id'
    }
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Marca', // Nombre de la tabla en la base de datos
      key: 'id'
    }
  }
},{
  schema: 'Equipos',
  timestamps: false,
}
  
);


Equipo.belongsTo(Direccion, { foreignKey: 'id_dir', as: 'direccion' });
Equipo.belongsTo(Marca, { foreignKey: 'id_marca', as: 'marca' });

sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos sincronizada');
}).catch(err => {
  console.error('Error al sincronizar base de datos:', err);
});

module.exports = Equipo;

