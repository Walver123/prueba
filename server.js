const express = require('express');
const { MongoClient, ObjectId } = require('mongoose');
const bcrypt = require('bcrypt');
const client = require('./conexion.js'); 

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/registrar-usuario', async (req, res) => {
  try {
    
    const db = client.db(dbName);
    const collection = db.collection('InicioSesion');

    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    if (!nombre || !correo || !contrasena) {
      console.log('Ningún dato puede ser nulo. Saliendo.');
      res.status(400).json({ message: 'Los datos no pueden ser nulos.' });
      return;
    }

    const contraseñaCifrada = await bcrypt.hash(contrasena, 10);

    const usuario = {
      _id: new ObjectId(), // Genera un ID automático
      nombre: nombre,
      correo: correo,
      contrasena: contraseñaCifrada,
    };

    await collection.insertOne(usuario);

    res.status(200).json({ message: 'Usuario registrado con éxito.' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
  console.log(`Ruta de registro de usuarios: http://localhost:${port}/registrar-usuario`);
});