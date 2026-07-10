const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testDatabaseConnection } = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`Servidor PetVibe rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Servidor não iniciado devido a erro na conexão com o banco de dados.');
    process.exit(1);
  }
}

startServer();
