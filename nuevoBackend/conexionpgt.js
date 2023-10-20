const pgp = require('pg-promise')();

const dbConfig = {
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5433,
    database: 'postgres',
  };
  
  module.exports = { dbConfig };

//   db.connect()
//   .then(() => console.log('Conectado a PostgreSQL'))
//   .catch(error => console.error('Error al conectar a PostgreSQL:', error));

// module.exports = { db };