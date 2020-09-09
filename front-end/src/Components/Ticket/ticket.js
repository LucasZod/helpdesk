import React, { useState, useEffect } from 'react';
import './index.css'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {getSolicitacoes, postChamado} from '../../Requests/api';
import { TextField, FormGroup, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export default function Ticket() {
    const classes = useStyles();
    const [tickets, setTicket] = useState([]);
    const [dados, setDados] = useState({solicitacao: '', descricao: '', informacao: ''});
    const [solList, setSolList] = useState([]);


    useEffect(() => {
        const userAut = () => {
            const user = localStorage.getItem('@usuarioHD');
            if (!user) { window.location.href = '/' }
        }
        userAut();
    })

    useEffect(()=>{
        const getApi = async () =>{
            const {data:{resultadoFinal}} = await getSolicitacoes();
            setSolList(resultadoFinal);
        }

        getApi();
    },[setSolList])

    const enviarTicket = async (e) => {
        e.preventDefault()

        if(dados.solicitacao === "" || dados.descricao === ""){
            if(dados.solicitacao !== ""){
                alert("O campo de Descrição deve ser preenchido")
            }else{
                alert("O campo de Solicitação deve ser preenchido!")
            }
            return;
        }

        setTicket([...tickets, dados])
        await postChamado(dados);
        setDados({solicitacao: '', descricao: '', informacao: ''})
    }


    return (
            <div className="container-ticket">
                <nav className="mainNav">
                <FormGroup className="">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Solicitações</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={dados.solicitacao}
                            onChange={e => setDados({ ...dados, solicitacao: e.target.value })}
                            >
                                {solList.map((sol, index)=>(
                                    <MenuItem key={index} value={sol.id}>{sol.nomesolicitacao}</MenuItem>
                                ))
                                }
                            </Select>
                    {dados.solicitacao === 14 || dados.solicitacao === 15 ?
                        <TextField
                            id = 'standard-multiline-static'
                            placeholder="Informação auxiliar"
                            onChange={(e) => setDados({...dados, informacao: e.target.value})}
                            value = {dados.informacao}
                            name = 'informacao'
                        /> : <div></div>}               
                    <TextField
                        id = 'standard-multiline-static'
                        placeholder="Descrição"
                        onChange={e => setDados({ ...dados, descricao: e.target.value })}
                        name='desc'
                        multiline
                        rows={8}
                        value={dados.descricao}
                    />
                    <Button color="primary" onClick={enviarTicket}>Gerar Chamado</Button>
                    </FormControl>
                </FormGroup>
                </nav>
                <footer className="mainFooter"></footer>
            </div>
    )
}