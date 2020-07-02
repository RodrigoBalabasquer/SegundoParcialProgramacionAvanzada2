//8)
module.exports = (req,res,next) =>{
    const rta = req.datos;
    var respuesta = [];
    for(var i = 0; i < rta.length; i++){
        if(rta[i].vacantes == 0)
        {
            var valor = new Object();
            valor.materia = rta[i].nombre.toUpperCase();
            valor.vacantes = rta[i].vacantes;
            valor.cuatrimestre = rta[i].cuatrimestre.toUpperCase();
            valor.profesor = {
                nombre: rta[i].profesor.nombre.toUpperCase(),
                email: rta[i].profesor.email.toUpperCase(),
            }
            valor.cantidadInscriptos = rta[i].cantidadInscriptos;
            respuesta.push(valor);
        }
         else
         {
            var valor = new Object();
            valor.materia = rta[i].materia;
            valor.vacantes = rta[i].vacantes;
            valor.cuatrimestre = rta[i].cuatrimestre;
            valor.profesor = {
                nombre: rta[i].profesor.nombre,
                email: rta[i].profesor.email,
            }
            valor.cantidadInscriptos = rta[i].alumnos.length;
            respuesta.push(valor);
         }
    }
    res.json(respuesta);
}