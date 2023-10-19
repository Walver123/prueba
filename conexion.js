const { MongoClient } = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'sgu_db';

const client = new MongoClient(url, { useUnifiedTopology: true });

async function conectarDB() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

conectarDB();

module.exports = client;