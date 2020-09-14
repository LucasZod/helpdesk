import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import './Botoes.css';
import sol from '../../Assets/sol.bmp';
import aco from '../../Assets/aco.bmp';
import lib from '../../Assets/lib.bmp';
import cad from '../../Assets/cad.bmp';
import sair from '../../Assets/sair.bmp';
import {getDados, liberacoesButtons} from '../../Requests/api';

export default function Botoes(){

    const login_valid = localStorage.getItem('@usuarioHD');
    const id = parseInt(localStorage.getItem('@idHD'));
    const [data, setData] = useState([]);
    const [modulo, setModulo] = useState([])

    useEffect(()=>{
        const GetData = async() =>{
           const dados = await getDados(id);
           setData(dados);
        }
        const getModules = async () =>{
            const modules = await liberacoesButtons();
            const objMod = {}
            modules.map((module)=>{
                return objMod[module.nome_botao] = module.excluido
            })
            setModulo(objMod);
        }
        GetData();
        getModules();
    },[id])


    const Buttons = [
        { id: "ac",  label: "Acompanhamento", vibilidade: modulo['Acompanhamento'], link: '/lista-tickets', classe: 'all-buttons', src:aco},
        { id: "sl",  label: "Solicitacoes", vibilidade: modulo['Solicitações'], link: '/ticket', classe: 'all-buttons', src:sol},
        { id: "cd",  label: "Cadastro", vibilidade: modulo['Cadastro de solicitações'], link: '/cadastro', classe: 'all-buttons', src:cad},
        { id: "lb",  label: "Liberações", vibilidade: modulo['Liberações'], link: '/liberacoes', classe: 'all-buttons', src:lib},
    ]

    const handlerLogout = (e) =>{
        e.preventDefault();
        var pergunta = window.confirm("Deseja fazer Logout?")
        if(pergunta){
        localStorage.clear();
        window.location.href = "/";
        }
        else{
            return;
        }
    }

    return(
        <div>
        <div className="container-botao">
            {   login_valid ?
                Buttons.map((botao)=>(
                <Link to = {botao.link} style={{ textDecoration: 'none', color: 'black' }}key={botao.id}>
                <div className={botao.vibilidade === 0 ? 'botao-div' : 'botao-div-oculto'} > 
                <input className={botao.classe} hidden={botao.vibilidade} type="image" alt="image" src={botao.src}/>
                <p hidden={botao.vibilidade}>{botao.label}</p>
                </div>
                </Link>
            )) : <input hidden={1}/> }
            { login_valid ?
                <div className="botao-div" onClick={handlerLogout}>
                <input alt="img-2" type="image" src={sair} width={68}/>
                <p>Logout</p>
                </div>
            : <input hidden={1}/>} 
        </div>
            {data.map((dat, index)=>(
                <div className="header-dados" key={index}>
                    <h5>{dat.login}</h5>
                    <h5>{dat.departamento}</h5>
                </div>
            ))}
        </div>
    );

}