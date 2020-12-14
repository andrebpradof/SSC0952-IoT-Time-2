let db = require('../../../db'); // Configurações do banco
var mqtt = require('mqtt');
var client = mqtt.connect(process.env.HOST_MQTT);  //Cria a conexão com o broker MQTT


client.on('connect', function() {// Conexão do cliente com o broker
    client.subscribe('2/response');
});

module.exports = {
    async status_ar(req,res){

        var query = req.params.time+'/ar/'+req.params.id;

        let ref = db.collection('Salas').doc(query); // Realiza a query
        ref.get() // Pega os resultados
        .then(doc => {
            if (!doc.exists) {
                res.status(500).json({error: 'Registros não encontrados!'});
            } else {
                console.log('>> Registro encontrado');
                return res.json(doc.data());
            }
        })
        .catch(err => {
            res.status(500).json({error: 'Erro ao buscar documento. Erro: '+err});
        });
    },
    async atualiza_ar(req,res,next){
        var topico = req.params.time+'/aircon/'+req.params.id;
        var code = parseInt(req.body['0'],10);
    
        if(isNaN(code)){
            return res.status(500).json({status:false, error: 'Informar o valor de índice 0'});
        }

        var mensagem = '{"0":'+code+',';
        if( (code-32) >= 0 ){

            if(typeof req.body['4'] === "undefined"){
                return res.status(500).json({status:false, error: 'Informar o valor de índice 4'});
            }

            code = code - 32;
            mensagem = mensagem+'"4":'+req.body['4']+','; 
        }
        if( (code-16) >= 0 ){

            if(typeof req.body['3'] === "undefined"){
                return res.status(500).json({status:false, error: 'Informar o valor de índice 3'});
            }

            code = code - 16;
            mensagem = mensagem+'"3":'+req.body['3']+',';
        }
        if( (code-8) >= 0 ){

            if(typeof req.body['2'] === "undefined"){
                return res.status(500).json({status:false, error: 'Informar o valor de índice 2'});
            }

            code = code - 8;
            mensagem = mensagem+'"2":'+req.body['2']+',';
        }
        if( (code-4) >= 0 ){

            if(typeof req.body['1'] === "undefined"){
                return res.status(500).json({status:false, error: 'Informar o valor de índice 1'});
            }

            code = code - 4;
            mensagem = mensagem+'"1":'+req.body['1']+',';
        }
        if( (code-2) >= 0 ){

            if(typeof req.body['22'] === "undefined"){
                return res.status(500).json({status:false, error: 'Informar o valor de índice 22'});
            }

            code = code - 2;
            mensagem = mensagem+'"22":'+req.body['22']+',';
        }
        if( (code-1) >= 0 ){

            if(typeof req.body['21'] === "undefined"){
                return res.status(500).json({status:false, error: 'Informar o valor de índice 21'});
            }

            code = code - 1;
            mensagem = mensagem+'"21":'+req.body['21']+',';
        }

       
        var indicador = parseInt(req.body['23'],10);
        if(isNaN(indicador)){
            return res.status(500).json({status:false, error: 'Informar o valor de índice 23'});
        }
        mensagem = mensagem+'"23":'+indicador+'}';
        console.log("Mensagem enviada: "+mensagem);
        var options={
            retain:true,
        };

        client.publish(topico,mensagem,options, function (err){
            if (!err) {
                return res.json({status:true});
            }
            else{
                return res.status(500).json({status:false, error: 'Problema ao enviar para o Broker'});
            }
        });
    }
};