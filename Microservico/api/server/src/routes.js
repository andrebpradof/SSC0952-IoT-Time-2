require("dotenv").config();
const jwt = require('jsonwebtoken');

const express = require('express');
const routes = express.Router();

const Auth = require('./controllers/Auth');
const Ar = require('./controllers/Ar');
const Sensor = require('./controllers/Sensor');

routes.post('/auth/login',Auth.login);
routes.post('/auth/logout',Auth.logout);

routes.get('/ar/:time/:id',verifyJWT,Ar.status_ar);
routes.post('/ar/:time/:id',verifyJWT,Ar.atualiza_ar);

routes.get('/sensor/:sala/:id',verifyJWT,Sensor.status_sensor);

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

module.exports = routes;