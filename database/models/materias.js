const {Schema,model, types, validate} = require('../db');

var StringValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 15],
    message: 'El string debe estar entre 5 y 15 caracteres'
  }),
];

const materiaSchema = new Schema({
    //_id: types.ObjectId,
    nombre: {
        type: String,
        require: true,
        unique: true,
        validate: StringValidator,
    },
    cuatrimestre:{
        type: String,
        required: true,
        enum: ['Primero', 'Segundo','Tercero', 'Cuarto']
    },
    vacantes: {
        type: Number,
        require: true,
    },
    profesor:{
        legajo: Number,
        nombre: String,
        email: String,
    },
    alumnos:[],
},
{
    timestamps: {
        createdAt: 'created_at',
        updateAt: 'updated_at',
        //currentTime: 'current_time',
    }
});

const materiaModel = model('materias',materiaSchema);

module.exports = materiaModel;