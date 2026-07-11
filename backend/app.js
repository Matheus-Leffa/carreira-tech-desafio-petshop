const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testDatabaseConnection } = require('./config/database');
const contatoRoutes = require('./routes/contatoRoutes');

// Carrega os models antes da sincronização para registrar as tabelas no Sequelize.
require('./models/Contato');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', contatoRoutes);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await testDatabaseConnection();

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('Sincronização automática do banco executada em desenvolvimento.');
    }

    app.listen(PORT, () => {
      console.log(`Servidor PetVibe rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Servidor não iniciado devido a erro na conexão com o banco de dados.');
    process.exit(1);
  }
}

startServer();
