const express = require('express');
const fs = require('fs');
const path = require('path');

// generar el objeto principal
const app = express();
app.set('view engine', 'ejs');

// usar directorios públicos
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// cargar datos desde el archivo JSON
let datos = JSON.parse(fs.readFileSync('alumnos.json', 'utf8'));

// ruta para renderizar la vista con la barra de navegación
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: "Listado de alumnos", 
        listado: datos, 
        vista: 'detalle' 
    });
});

// rutas adicionales
app.get('/practica01', (req, res) => {
    res.render('practica01');
});

app.get('/cotizacion', (req, res) => {
    res.render('practica02');
});

app.get('/practica03', (req, res) => {
    res.render('practica03');
});

// ruta para la página de examen
app.get('/examen', (req, res) => {
    res.render('examen', { 
        titulo: 'Examen Unidad II', // Aquí agregamos el título que se pasará a la vista
        listado: datos, 
        vista: 'detalle' 
    });
});

// ruta para filtrar
app.post('/filtrar', (req, res) => {
    const { nivel, turno, vista } = req.body;

    // Definición de niveles y turnos
    const niveles = {
        'primaria': 1,
        'secundaria': 2,
        'preparatoria': 3
    };

    const turnos = {
        'matutino': 1,
        'vespertino': 2
    };

    // Filtrar los alumnos según el nivel y turno seleccionados
    let filtrados = datos.filter(alumno =>
        (nivel === 'todos' || alumno.nivel === niveles[nivel]) &&
        (turno === 'todos' || alumno.turno === turnos[turno])
    );

    // Si la vista seleccionada es 'resumen', calculamos los datos del resumen
    if (vista === 'resumen') {
        const total = filtrados.length;
        const promedioGeneral = total > 0 ? 
            (filtrados.reduce((acc, alumno) => acc + alumno.promedio, 0) / total).toFixed(2) : 0;
        const menorIgual7 = filtrados.filter(alumno => alumno.promedio <= 7).length;
        const mayorIgual7 = filtrados.filter(alumno => alumno.promedio >= 7).length;

        // Renderizar vista con los datos resumidos
        res.render('examen', {
            titulo: 'Resumen de Alumnos',
            vista,
            resumen: { total, promedioGeneral, menorIgual7, mayorIgual7 },
            listado: []
        });
    } else {
        // Renderizar vista con los detalles de los alumnos filtrados
        res.render('examen', {
            titulo: 'Detalle de Alumnos', // Aquí también se pasa el título adecuado
            vista,
            listado: filtrados
        });
    }
});

// configurar el puerto
const puerto = 80;
app.listen(puerto, () => {
    console.log("El servidor está escuchando en el puerto " + puerto);
});
