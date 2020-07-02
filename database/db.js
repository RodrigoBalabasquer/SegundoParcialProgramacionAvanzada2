const mongoose = require('mongoose');
var validate = require('mongoose-validator');
mongoose.connect('mongodb://localhost/mmm',{ useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));

db.once('open', function (){

});

module.exports.Schema = mongoose.Schema;
module.exports.model = mongoose.model;
module.exports.types = mongoose.Schema.Types;
module.exports.validate = validate;