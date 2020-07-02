const {Schema,model, types, validate} = require('../db');

var StringValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 15],
    message: 'El string debe estar entre 5 y 15 caracteres'
  }),
];
var PasswordValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'El string debe estar entre 3 y 50 caracteres'
  }),
];

const userSchema = new Schema({
    //_id: types.ObjectId,
    legajo: {
        type: Number,
        unique: true,
        require: true,
        max: 2000,
        min: 1000,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        validate: StringValidator,
    },
    nombre: {
        type: String,
        require: true,
        validate: StringValidator,
    },
    clave: {
        type: String,
        require: true,
        validate: PasswordValidator,
    },
    tipo:{
        type: String,
        required: true,
        enum: ['alumno', 'profesor','admin']
    },
},
{
    timestamps: {
        createdAt: 'created_at',
        updateAt: 'updated_at',
        //currentTime: 'current_time',
    }
});

const userModel = model('usuarios',userSchema);

module.exports = userModel;