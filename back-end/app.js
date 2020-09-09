const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rotaProdutos = require('./routes/usuarios');
const rotaChamados = require('./routes/tickets');
const rotaSolicitacoes = require('./routes/solicitacoes');
const rotaLib = require('./routes/liberacoes');
var cors = require('cors');

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors())

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers: Content-Type");

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'POST', 'PUT, PATCH, DELETE, GET');
            return res.status(200).send({});
        }
        next();
    });

    app.use('/usuarios', rotaProdutos);
    app.use('/chamados', rotaChamados);
    app.use('/solicitacoes', rotaSolicitacoes);
    app.use('/liberacoes', rotaLib);

    app.use((req, res, next) => {
        const erro = new Error('Não encontrado');
        erro.status = 404;
        next(erro);
    })

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        return res.send({
            erro: {
                mensagem: error.message
            }
        })
    })

module.exports = app;