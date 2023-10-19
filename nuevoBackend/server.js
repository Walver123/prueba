const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./modelo.js');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://stevgtpayes:root1234@cluster0.ohcx1sx.mongodb.net/prueba?retryWrites=true&w=majority');//insertar string de conexion

app.use(express.json());
app.use(express.static('public'));

app.post('/registrar-usuario', async (req, res) => {
  const {body} = req;
  console.log(body);
  try{
      const isUser = await User.findOne({correo: body.correo});
      if(isUser){
          return res.status(403).send('user already exists');
      }
      const userRegister = await User.create({correo: body.correo, contrasena: body.contrasena, });
      console.log(userRegister);
      res.send(userRegister);
  }catch(e){
      console.error(e);
      res.status(500).send(e.message);
  };
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
  console.log(`Ruta de registro de usuarios: http://localhost:${port}/registrar-usuario`);
});