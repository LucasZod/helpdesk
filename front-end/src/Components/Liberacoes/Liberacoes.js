import React, { useState, useEffect } from 'react';
import './Liberacoes.css'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Checkbox from '@material-ui/core/Checkbox';
import {getUsers, liberacoesItems, liberacoesItemsPatch, liberacoesButtons} from '../../Requests/api';
import {Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 470,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto"
  },
}));

export default function Liberacoes(){

    const idUser = parseInt(localStorage.getItem('@idHD'));
    if(!idUser) { window.location.pathname = '/'}

    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [liberacoes, setLiberacoes] = useState([]);
    const [checked, setChecked] = React.useState([]);
    const [botoes, setBotoes] = React.useState([]);
    const [modulo, setModulo] = useState([])

    useEffect(()=>{
        const getModules = async () =>{
            const modules = await liberacoesButtons();
            const objMod = {}
            modules.map((module)=>{
                return objMod[module.nome_botao] = module.excluido
            })
            setModulo(objMod);
        }
        getModules();
    },[setModulo])

    useEffect(()=>{

        const usersApi = async() =>{
            const response = await getUsers();
            setUsers(response)
        }

        usersApi();
    },[setUsers])


    const Lib = modulo['Liberações'];
    if(Lib === 1) { window.location.pathname = '/index'}
    
    const handlerClick = async(id_usuario) =>{
        await liberacoesItems(id_usuario).then(res => setLiberacoes(res));
    }

    const handleToggle = (id, excluido) => () => {
        const newLiberacao = liberacoes.filter((liberacao) => (liberacao.id === id))
        if(excluido === 0){
            newLiberacao[0].excluido = 1;
            excluido = 1;
        }else if(excluido === 1){
            newLiberacao[0].excluido = 0;
            excluido = 0
        }
        setChecked(newLiberacao)
        console.log(checked);
        
        botoes.forEach((botao, index)=>{
        if(botao.id === id){
            return botoes.splice(index, 1)
        }
        })
        const btns = {id, excluido}
        setBotoes([...botoes, btns])
      };


    const handlerSalvar = async() =>{
        if(Lib === 1){
            alert('Você não tem permissão para esse módulo')
            return;
        }
        if(!botoes.length){
            alert('Não há botoes selecionados!')
            return;
        }
        const pergunta = window.confirm('Deseja salvar alterações?');
        if(!pergunta){
            return;
        }
        await botoes.forEach((btn)=>{
            liberacoesItemsPatch(btn);
        })
        window.location.reload();
        }


   const RenderUser = () => (
        users.map((user)=>{
            return(
        <ListItem button aria-checked={true} key={user.id} onClick={e=>{handlerClick(user.id)}}>
            <ListItemText primary={user.login} />
        </ListItem>
            );
        }))

  const RenderLib = () => (
    liberacoes.map((liberacao)=>(
    <ListItem button key={liberacao.id} onClick={handleToggle(liberacao.id, liberacao.excluido)} >
        <Checkbox
                edge="start"
                checked={liberacao.excluido !== 1}
                tabIndex={-1}
                disableRipple
              />
        <ListItemText primary={liberacao.nome_botao}/>
    </ListItem>
  )))

    return(
        <div className="liberacao-container">
            <div className="liberacao-users">
            <p>Usuarios</p>
            <div className={classes.root}>
                <List>
                <RenderUser/>
                </List>
            </div>
            </div>
            <div className="liberacao-check">
            <p>Botoes</p>
                <div className={classes.root}>
                    {liberacoes.length ? <List><RenderLib/></List> : <p>Selecionar colaborador</p> }
                </div>
            </div>
            <div className="liberacao-footer">
                <Button onClick={handlerSalvar} color="primary">Salvar</Button>
            </div>
        </div>
    )
}