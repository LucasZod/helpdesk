const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const jwt = require('jsonwebtoken');


router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb_usuario',
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

router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT * FROM tb_usuario WHERE id = ?`,
            [req.params.id],
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({resposta: resultado})

            }
        )
    })
});

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `insert into tb_usuario(usuario, login, senha, cpf, tipo, empresa, departamento,
            status, datacadastro, excluido, email, created_at, updated_at, idhash, password, alterpassword) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [req.body.usuario, req.body.login, req.body.senha, req.body.cpf, req.body.tipo,
            req.body.empresa, req.body.departamento, req.body.status, req.body.datacadastro,
            req.body.excluido, req.body.email, req.body.created_at, req.body.updated_at,
            req.body.idhash, req.body.password, req.body.alterpassword],
            (error, resultado, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: "Usuario cadastrado com sucesso!"
                });
            }

        )
    })
});

router.patch('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE tb_usuario
              SET usuario = ?,
                  senha   = ?
            WHERE id      = ?`,
            [
                req.body.usuario,
                req.body.senha,
                req.body.id
            ],
            (error, resultado, fields) =>{
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(201).send({resposta: resultado})

            }
        )
    })

});

router.post('/login',(req, res, next)=>{

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error})}
        const query = `SELECT * FROM tb_usuario WHERE login = ?`;
        conn.query(query, [req.body.login],
            (error, resultado, fields) =>{
                conn.release();
                    if(error) {return res.status(500).send({error: error})}

                    if (resultado.length < 1){return res.status(401).send({mensagem: 'Falha na autenticação!'})}

                    if(req.body.senha === resultado[0].senha) {
                        const token = jwt.sign({
                            id: resultado[0].id,
                            login: resultado[0].login,   
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })

                        return res.status(200).send({
                            mensagem: 'Autenticado com sucesso!',
                            token: token,
                            valid: 'OK',
                            departamento: resultado[0].departamento,
                            id: resultado[0].id,
                            usuario: resultado[0].usuario,
                            tipo: resultado[0].tipo
                        })
                    }

                    return res.status(401).send({mensagem: 'Falha na autenticação!'})
            }    
        )
    })
})


router.post('/teste', (req, res)=>{
    const login = req.body.login
    console.log(`POST FEITO COM SUCESSO ${login}`)
    res.send({login:login})
    
})


module.exports = router;