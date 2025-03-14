const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');


//generar el objeto principal
const app = express();
app.set('view engine','ejs')

//usar directorios publicos
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));



//declarar un array de objetos
let datos = JSON.parse(fs.readFileSync('Datos.json', 'utf8'));


//primer peticion por el metodo get
app.get('/',(req,res)=>{
    res.render('index',{titulo:"Listado de alumnos",listado:datos})
})

app.get('/practica01',(req,res)=>{
    res.render('practica01');
})

app.get('/cotizacion',(req,res)=>{
    const params = {
        valor: req.query.valor,
        pinicial: req.query.pinicial,
        plazos: req.query.plazos,   
    }
    res.render('practica02', params);
})

app.post('/cotizacion',(req,res)=>{
    const params = {
        valor: req.body.valor,
        pinicial: req.body.pinicial,
        plazos: req.body.plazos,
    }
    res.render('practica02', params);
})

const puerto = 80;
app.listen(puerto,()=>{
    console.log("El puerto esta escuchando");
})