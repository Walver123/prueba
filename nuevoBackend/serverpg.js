const express = require('express');
const bodyParser = require('body-parser');
const { dbConfig } = require('./conexionpgt.js');
const pgp = require('pg-promise')();

const app = express();
const port = 5000;

const db = pgp(dbConfig); 

async function conectarDBpgt() {
  try {
    await db.connect();
    console.log('Conectado a PostgreSQL con pg-promise');
  } catch (error) {
    console.error('Error al conectar a PostgreSQL con pg-promise:', error);
  }
}

conectarDBpgt();


app.post('/registrar-usuariopgt', async (req, res) => {
  try {
    const { nombre, apellido, fechaNacimiento } = req.body;

    if (!nombre || !apellido || !fechaNacimiento) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    const insertQuery = `
      INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, fecha_creacion)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `;

    const result = await db.one(insertQuery, [nombre, apellido, fechaNacimiento]);

    res.status(200).json({
      message: 'Usuario registrado con éxito',
      userId: result.id,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
});

app.put('/actualizar-usuariopgt/:id', async (req, res) => {
  try {
    const { nombre, apellido, fechaNacimiento } = req.body;
    const userId = req.params.id;

    if (!nombre || !apellido || !fechaNacimiento) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    const updateQuery = `
      UPDATE usuarios
      SET nombre = $1, apellido = $2, fecha_nacimiento = $3
      WHERE id = $4;
    `;

    await db.none(updateQuery, [nombre, apellido, fechaNacimiento, userId]);

    res.status(200).json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
});

app.delete('/eliminar-usuariopgt/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const deleteQuery = `
      DELETE FROM usuarios
      WHERE id = $1;
    `;

    await db.none(deleteQuery, [userId]);

    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});