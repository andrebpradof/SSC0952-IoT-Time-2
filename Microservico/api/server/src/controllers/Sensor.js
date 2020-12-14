let db = require('../../../db'); // Configurações do banco

module.exports = {
    async status_sensor(req,res){

        var query = req.params.sala+'/sensores/'+req.params.id;

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
};