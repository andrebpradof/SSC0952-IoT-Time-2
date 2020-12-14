let db = require('../db'); // Configurações do banco
const admin = require('firebase-admin');

const sala = 2;

// Converte a data vinda do broker para o padrão do Firebase
function convert_data(dateString){

    var dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('/'),
    date;

    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1],timeParts[2]);
    return admin.firestore.Timestamp.fromDate(date);
}

// Tranforma a data em seu valor em segundos
function convert_data_to_time(dateString){

    var dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('/'),
    date;

    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1],timeParts[2]);
    return date.getTime();
}

// Pega a data atual e retorna em forma de string
function string_data(){
    var data = new Date();

    // Guarda cada parte em uma variável
    var dia     = data.getDate();           // 1-31
    var mes     = data.getMonth();          // 0-11 (zero=janeiro)
    var ano4    = data.getFullYear();       // 4 dígitos
    var hora    = data.getHours();          // 0-23
    var min     = data.getMinutes();        // 0-59
    var seg     = data.getSeconds();        // 0-59

    // Formata a data e a hora (note o mês + 1)
    return dia+'/'+(mes+1)+'/'+ano4+' '+hora+':'+min+':'+seg;
}

// Atualiza o registro na base de dados
function atualiza_registro_bd(obj,tipo,data){
    let doc_sensor = db.collection('Salas').doc(sala+'/'+tipo+'/'+obj['0']);
    let set = doc_sensor.update(data);
}

// Insere a leitura na base de dados
function insere_registro_bd(obj,tipo,data){
    let doc_registro = db.collection('Salas').doc(sala+'/'+tipo+'/'+obj['0']+'/registros/'+convert_data_to_time(obj['s']));
    let set = doc_registro.set(data);
}

// Atualiza o registro do ar condicionado na base de dados
function atualiza_ar(ar){
    var data = { 
        'id': ar.id,
        'temp_atual': ar.temp_atual,
        'temp_min': ar.temp_min,
        'temp_max': ar.temp_max, 
        'on_off': ar.on_off,
        'status_sala': ar.status_sala,
        'registro': ar.registro,
        'data': convert_data(string_data())
    };
    var id_ar = {'0': 24, 's': string_data()};

    atualiza_registro_bd(id_ar,'ar',data);
    insere_registro_bd(id_ar,'ar',data);
}

// Realiza a busca dos dados da última atualização do ar no banco 
function set_ar(query){
    let ref = db.collection('Salas').doc(query); // Realiza a query
    ref.get() // Pega os resultados
    .then(doc => {
        if (!doc.exists) {
            console.log('Registros não encontrados! Carregando valores padrões');
        } else {
            ar = { // Seta os valores recebidos
                id: doc.data().id,
                temp_atual:doc.data().temp_atual,
                temp_max:doc.data().temp_max,
                temp_min:doc.data().temp_min,
                on_off:doc.data().on_off,
                status_sala:doc.data().status_sala,
                registro:doc.data().registro,
            } 
        }
    })
    .catch(err => {
        console.log('Erro ao buscar documento', err);
    });
}
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
}
module.exports = { isJson, convert_data, convert_data_to_time, string_data, atualiza_registro_bd, insere_registro_bd, atualiza_ar, set_ar};