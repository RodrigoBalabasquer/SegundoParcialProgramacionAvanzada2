const jwt = require('jsonwebtoken');
const config = require('../../config.js');

module.exports.sign = sign;
function sign(payload){
    return jwt.sign(payload, config.llave, {
    expiresIn: 30000
  });
}

module.exports.verify = verify;
function verify(token){
    try{
        var decode = jwt.verify(token,config.llave);
        return decode
    }
    catch(error){
        return false;
    }
}