import React from 'react';
import {Link} from 'react-router-dom'
import './Botoes.css';
import sol from '../../Assets/sol.bmp';
import aco from '../../Assets/aco.bmp';
import lib from '../../Assets/lib.bmp';
import cad from '../../Assets/cad.bmp';
import sair from '../../Assets/sair.bmp';

export default function Botoes(){

    const login_valid = localStorage.getItem('@usuarioHD');


    const Buttons = [
        { id: "ac",  label: "Acompanhamento", vibilidade: parseInt(localStorage.getItem('@Aco')), link: '/lista-tickets', classe: 'all-buttons', src:aco},
        { id: "sl",  label: "Solicitacoes", vibilidade: parseInt(localStorage.getItem('@Sol')), link: '/ticket', classe: 'all-buttons', src:sol},
        { id: "cd",  label: "Cadastro", vibilidade: parseInt(localStorage.getItem('@Cad')), link: '/cadastro', classe: 'all-buttons', src:cad},
        { id: "lb",  label: "Liberações", vibilidade: parseInt(localStorage.getItem('@Lib')), link: '/tickets', classe: 'all-buttons', src:lib},
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
        
        <div className="container-botao">
            {   login_valid ?
                Buttons.map((botao)=>(
                <div className={botao.vibilidade === 0 ? 'botao-div' : 'botao-div-oculto'} key={botao.id}> 
                <Link to = {botao.link}>
                <input className={botao.classe} hidden={botao.vibilidade} type="image" alt="image" src={botao.src}/>
                </Link>
                <p hidden={botao.vibilidade}>{botao.label}</p>
                </div>
            )) : <input hidden={1}/> }
            { login_valid ?
                <div className="botao-div">
                <input alt="img-2" onClick={handlerLogout} type="image" src={sair} width={68}/>
                <p>Logout</p>
                </div>
            : <input hidden={1}/>} 
        </div>
    );

}