const express = require('express');
const mysql = require('../mysql').pool;
const router = express.Router();


router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb_solicitacao',
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const date = (data) => {
                    var dia = data.getDate();
                    var mes = data.getMonth() + 1;
                    var ano = data.getFullYear();
             
                    if(dia < 10){ dia = '0' + dia }
                    if(mes < 10){ mes = '0' + mes }
                    const dataCompleta = `${dia}/${mes}/${ano}`
                    return dataCompleta;
                 }

                const result = {
                        resultadoFinal: resultado.map((sol)=>({
                            id: sol.id_sol,
                            nomesolicitacao: sol.nome_solicitacao,
                            observacao: sol.observacao,
                            dt_created: date(sol.created_at),
                            dt_updated: date(sol.update_at)
                        }))
                }

                return res.status(200).send(result)
            }
        )
    })
});


router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `insert into tb_solicitacao(nome_solicitacao, observacao, excluido) 
            VALUES (?,?,?)`,
            [req.body.nomesolicitacao, req.body.observacao, req.body.excluido],
            (error, resultado, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: "Solicitação cadastrada com sucesso!",
                    result: resultado
                });
            }

        )
    })
});


module.exports = router;