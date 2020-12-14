require("dotenv").config();
var mqtt = require('mqtt') // Faz o requerimento do modulo MQTT
var client = mqtt.connect(process.env.HOST_MQTT)  //Cria a conexão com o broker MQTT

client.on('connect', function() {// Conexão do cliente com o broker
    client.subscribe('2/response', function(err) {
        if (!err) {
            // client.publish('2/temp/20', '{"s":"17/12/2020 22:22:40","0":21,"temp":40}')
            // client.publish('2/temp/20', '{"s":"14/11/2020 23:47:00","0":22,"temp":21}');
            // client.publish('2/umid/21', '{"s":"14/11/2020 23:49:00","0":22,"umid":67}');
            // client.publish('2/luz/26', '{"s":"17/11/2020 23:51:00","21":1,"0":26}');
            // client.publish('2/movimento/25', '{"s":"14/11/2020 23:55:00","0":25}');
            // client.publish('2/response', '{"s":"18/11/2020 23:15:00","0":24,"21":1,"4":20,"3":10,"1":22,"2":19,"22":0,"23":12345}');
            // client.end();
        }
    })
})
client.on('message', function(topic, message) { // Cliente recebe as mensagens inscritas no broker 
    console.log(topic);
    console.log(message.toString());  
})