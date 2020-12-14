require("dotenv").config();
const jwt = require('jsonwebtoken');
var uniqid = require('uniqid');

module.exports = {
    async login(req,res,next){
        //esse teste abaixo deve ser feito no seu banco de dados
        if(req.body.user === 'xxx' && req.body.password === 'xxxxxxxxxx'){
            //auth ok
            const id = uniqid(); //esse id viria do banco de dados
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 86400
            });
            return res.json({ auth: true, token: token });
        }
        res.status(500).json({ auth: false, error: 'Login inválido!'});
    },
    async logout(req,res,next){
        res.json({ auth: false, token: null });
    }
};