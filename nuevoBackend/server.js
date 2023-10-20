const express = require('express');
const { dbName } = require('./conexion.js');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

async function conectarDB() {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB con Mongoose');
  } catch (error) {
    console.error('Error al conectar a MongoDB con Mongoose:', error);
  }
}

conectarDB();

app.use(express.json());
app.use(express.static('public'));

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  contrasena: String,
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

app.post('/registrar-usuario', async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    if (!nombre || !correo || !contrasena) {
      console.log('Ningún dato puede ser nulo. Saliendo.');
      res.status(400).json({ message: 'Los datos no pueden ser nulos.' });
      return;
    }

    const usuario = new Usuario({
      nombre: nombre,
      correo: correo,
      contrasena: contrasena,
    });

    await usuario.save();

    res.status(200).json({ message: 'Usuario registrado con éxito.' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
});

app.put('/actualizar-usuario/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    const updateData = {
      nombre: nombre,
      correo: correo,
      contrasena: contrasena,
    };

    const updatedUser = await Usuario.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario actualizado con éxito', usuario: updatedUser });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
});

app.delete('/eliminar-usuario/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await Usuario.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});