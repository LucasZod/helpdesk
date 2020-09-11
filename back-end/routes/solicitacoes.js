const express = require('express');
const mysql = require('../mysql').pool;
const router = express.Router();


router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb_solicitacao WHERE excluido <> 1',
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const result = {
                        resultadoFinal: resultado.map((sol)=>({
                            id: sol.id_sol,
                            nomesolicitacao: sol.nome_solicitacao,
                            observacao: sol.observacao,
                            dt_created: sol.created_at,
                            dt_updated: sol.update_at
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


router.patch('/ocultar/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE tb_solicitacao
              SET excluido = ?
              WHERE id_sol     = ?`,
            [
                req.body.excluido,
                req.body.id
            ],
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error })}

                return res.status(201).send({resposta: resultado})

            }
        )
    })

});




module.exports = router;