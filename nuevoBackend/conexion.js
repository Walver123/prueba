const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'sgu_db';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

module.exports = { dbName };