const admin = require('firebase-admin') // Faz requerimento do modulo da base de dados Firebase

let serviceAccount = require('./iot-2020-firebase.json');  //Adiciona o arquivo de configuração do Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin.firestore(); //Cria a conexão com o Cloud Firestore do Firebase