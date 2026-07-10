const { Sequelize } = require('sequelize');

const databaseName = process.env.DB_DATABASE;
const databaseUser = process.env.DB_USER;
const databasePassword = process.env.DB_PASSWORD;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;

const sequelize = new Sequelize(databaseName, databaseUser, databasePassword, {
  host: databaseHost,
  port: Number(databasePort),
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true
  }
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o PostgreSQL:');
    console.error(error.message);
    throw error;
  }
}

module.exports = {
  sequelize,
  testDatabaseConnection
};