const express = require('express');
const { query } = require('express');
const mysql = require('../mysql').pool;
const router = express.Router();


router.post('/',(req, res)=>{

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error:error})}

        conn.query(
            `insert into tb_chamados(id_usuario, id_solicitacao, observacao, excluido, data_prevista, data_finalizada,
                observacao_finalizada, informacao) VALUES(?,?,?,?,?,?,?,?)`,
                [req.body.id_usuario, req.body.id_solicitacao, req.body.observacao, req.body.excluido, req.body.data_prevista,
                req.body.data_finalizada, req.body.observacao_finalizada, req.body.informacao],
                (error, resultado, field) =>{
                    conn.release();
                    
                    if(error){return res.status(500).send({error:error})}

                    res.status(201).send({
                        mensagem: "Chamado gerado com sucesso!",
                        Valid: "OK",
                        res: resultado,
                    })

                }
        )
    })

})


router.get('/:id_usuario', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const chave = parseInt(req.params.id_usuario);
        var myQuery = '';
        if(chave === 37){
             myQuery = `SELECT CHA.id, US.login, DP.departamento, CHA.data_prevista, SOL.nome_solicitacao, CHA.observacao, SOL.id_sol, CHA.observacao_finalizada
            FROM tb_chamados as CHA
            LEFT JOIN tb_usuario as US ON CHA.id_usuario = US.id
            LEFT JOIN tb_departamento as DP ON US.departamento = DP.id
            LEFT JOIN tb_solicitacao as SOL ON CHA.id_solicitacao = SOL.id_sol`
        }else{
            myQuery = `SELECT CHA.id, US.login, DP.departamento, CHA.data_prevista, SOL.nome_solicitacao, CHA.observacao, SOL.id_sol, CHA.observacao_finalizada
            FROM tb_chamados as CHA
            LEFT JOIN tb_usuario as US ON CHA.id_usuario = US.id
            LEFT JOIN tb_departamento as DP ON US.departamento = DP.id
            LEFT JOIN tb_solicitacao as SOL ON CHA.id_solicitacao = SOL.id_sol
            WHERE CHA.id_usuario = ?`
        }
        conn.query(
            myQuery,
            [req.params.id_usuario],
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

                 const response = {
                     listaChamados: resultado.map((items)=>({
                        id_chamado: items.id,
                        login: items.login,
                        departamento: items.departamento,
                        solicitacao: items.nome_solicitacao,
                        dataprevista: date(items.data_prevista),
                        chamado: items.observacao,
                        id_solicitacao: items.id_sol,
                        observacao_finalizada: items.observacao_finalizada
                     })       
                     )
                 }

                return res.status(200).send(response)
            }
        )
    })
});


router.get('/all', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb_chamados',
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                    const response = {
                        usuariosResumo: resultado.map((user)=>({
                            login: user.login,
                            administrador: user.tipo
                        }))
                    }
                return res.status(200).send(resultado)
            }
        )
    })
});


router.patch('/att', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE tb_chamados
              SET id_solicitacao = ?,
                  observacao     = ?
            WHERE id             = ?`,
            [
                req.body.id_sol,
                req.body.observacao,
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


router.patch('/res', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE tb_chamados SET observacao_finalizada = ?  WHERE id = ?`,
            [
                req.body.observacao_finalizada,
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

router.delete('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM tb_chamados WHERE id = ?`,
            [req.params.id],
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error })}

                return res.status(201).send({resposta: resultado})

            }
        )
    })

});

module.exports = router;