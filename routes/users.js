var express = require('express');
var router = express.Router();
const {usuarios, materias} = require('../database');
const mongoose = require('mongoose');
const {sign,verify} = require("../modules/jwt");
const tipografia = require('./tipografia');

function validarToken(req,res,next){
  const token = req.get("token");
  if (token) {
    const payload = verify(token);
    if(!payload){
        res.json("Error con el token");
        return;
    }
    req.user = payload;
    next();    
  } 
  else {
    res.send({ 
        mensaje: 'Token no proveída.' 
    });
  }
  // next();
}

//1)
router.post('/', function(req, res, next) {
  try{
    const nuevo = new usuarios({
      clave: req.body.clave,
      tipo: req.body.tipo,
      legajo: req.body.legajo,
      nombre: req.body.nombre,
      email: req.body.email,
    })
    nuevo.save((err,data) =>{
      if(err){
        res.json({err});
        return;
      }
      res.json(data);
    })
  }
  catch (error){
    res.json({error});
  }
  // res.json(req.body);
});

//2)
router.post('/login', async function(req, res, next) {
  try{
    const rta = await usuarios.find({clave: req.body.clave,email: req.body.email});

    if(rta.length > 0){
      const payload = {
      tipo:  rta[0].tipo,
      legajo: rta[0].legajo,
      email: rta[0].email,
      nombre: rta[0].nombre,
      };
      //res.json(payload);
      const token = sign(payload);
      res.json({
      mensaje: 'Autenticación correcta',
      token: token
      });
    }
    else{
       res.json({ mensaje: "Usuario o contraseña incorrectos"})
    }
  }
  catch (error){
    res.json({error});
  }
});

//Validacion de token
router.use(validarToken);

//3)
router.post('/materias', async function(req, res, next) {
  try{
    if(req.user.tipo == "admin")
    { 
      const rta = await usuarios.find({legajo: req.body.legajoProfesor,tipo:'profesor'});
      const nuevo = new materias({
        nombre: req.body.materia,
        cuatrimestre: req.body.cuatrimestre,
        vacantes: req.body.vacantes,
        profesor:{
          legajo: rta[0].legajo,
          email: rta[0].email,
          nombre: rta[0].nombre,
        }
      });
      nuevo.save((err,data) =>{
        if(err){
          res.json({err});
          return;
        }
        res.json(data);
      }) 
    }
    else{
      res.json({mensaje: "No tiene Permisos"});
    }
  }
  catch (error){
    res.json({error});
  }
});

//4)
router.get('/materias/:id', async function(req, res, next) {
  try{
    const materia = await materias.find({_id: mongoose.Types.ObjectId(req.params.id)});
    if(req.user.tipo == "alumno"){
      materia[0].alumnos = null;
      res.json(materia);
    }
    else{
      res.json(materia);
    }
  }
  catch (error){
    res.json({error});
  }
});

//5)
router.put('/materias/:idMateria/:legajoProfesor',async function (req,res){
    try{
    if(req.user.tipo == "admin")
    { 
      const profesor = await usuarios.find({legajo: req.params.legajoProfesor,tipo:'profesor'});
      const updateMateria = await materias.update({
        _id: mongoose.Types.ObjectId(req.params.idMateria)
      },{
        profesor:{
          legajo: profesor[0].legajo,
          email: profesor[0].email,
          nombre: profesor[0].nombre,
        },
      })
      res.json(updateMateria);
    }
    else{
      res.json({mensaje: "No tiene Permisos"});
    }
  }
  catch (error){
    res.json({error});
  }
})

//6)
router.put('/materias/:id',async function (req,res){
  try{
    if(req.user.tipo == "alumno")
    { 
      const materia = await materias.find({_id: mongoose.Types.ObjectId(req.params.id)});
      
      const alumno = new Object();
      alumno.nombre= req.user.nombre;
      alumno.email= req.user.email;
      alumno.legajo= req.user.legajo;

      if(materia[0].vacantes > 0)
      {
        const alumnos = materia[0].alumnos;
        alumnos.push(alumno);
        const vacantes = materia[0].vacantes - 1;
        res.json(materia[0]);
        const updateMateria = await materias.update({
          _id: mongoose.Types.ObjectId(req.params.idMateria)
        },
        {
          alumnos:alumnos,
          vacantes: vacantes,
      })
      res.json(updateMateria);
      }
      else{
        res.json({mensaje:"No hay vacantes"});
      }
    }
    else{
      res.json({mensaje: "No tiene Permisos"});
    }
  }
  catch (error){
    res.json({error});
  }
})

//7)
router.get('/materias', [async function(req, res, next) {
  try{
    const rta = await materias.find();
    req.datos = rta;
    //En el middleware tipografia se muestran los datos
    next();
  }
  catch (error){
    res.json({error});
  }
},tipografia]);


module.exports = router;
