const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.post('/',(req, res)=>{

    mysql.getConnection((error, conn)=>{
        if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                `SELECT * FROM tb_liberacaousuario WHERE id_usuario = ?`,
                [req.body.id],
                (error, resultado) => {
                    conn.release();

                    if (error) { return res.status(500).send({ error: error }) }

                    return res.status(200).send({resposta: resultado})
                }
            )
    })
});


router.get('/:id_usuario', (req, res)=>{
    
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            `SELECT * FROM tb_liberacaousuario WHERE id_usuario = ?`,
            [req.params.id_usuario],
            (error, resultado) =>{
                conn.release();

                if(error) {return res.status(500).send({error: error})}

                return res.status(200).send({resposta: resultado})
            }
        )
    })
})

router.patch('/', (req, res)=>{
    
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            `UPDATE tb_liberacaousuario SET excluido = ?  WHERE id = ?`,
            [req.body.excluido, req.body.id],
            (error, resultado) =>{
                conn.release();

                if(error) {return res.status(500).send({error: error})}
                
                return res.status(200).send({resposta: resultado})
            }
        )
    })
})

module.exports = router;