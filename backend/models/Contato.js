const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/database');

const Contato = sequelize.define('Contato', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  servico: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'contatos'
});

module.exports = Contato;