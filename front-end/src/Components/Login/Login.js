import React, {useState, useEffect} from 'react';
import {loginUser, liberacoesButtons} from '../../Requests/api';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ImgLogin from '../../Assets/Login.jpg';
import './index.css';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    inputitems:{
    }
  }));

export default function Login(){

const classes = useStyles();

const [logar, setLogin] = useState(
    {
        login: "",
        senha: ""
    }
)

useEffect(()=>{
    const userAut = () => {
        const user = localStorage.getItem('@usuarioHD');
        if (user) { window.location.href = '/lista-tickets' }
    }
    userAut();
})


const log = async(e) =>{
    
    e.preventDefault()
    await loginUser(logar);
    await liberacoesButtons();
    window.location.pathname = "/index";
    
}

return(
    <div className = "container-login">
        <div className = "form-items">
        <form className={classes.root} noValidate autoComplete="off">
        <TextField className={classes.inputitems}
        id="outlined-basic 1"
        variant="outlined"
        name = "User"
        label = "Usuario"
        onChange = {e => setLogin({...logar, login: e.target.value})}
        />
        <TextField className={classes.inputitems}
        id="outlined-basic 2"
        variant="outlined"
        name = "Password"
        label="Senha"
        onChange = {e => setLogin({...logar, senha: e.target.value})}
        type = "password"
        />
        <Button variant="contained" color="primary" className = "botao" onClick={log}>Logar</Button>
        
        </form>
        </div>
        <div className="aside-items">
            <aside className = "items-img">
            <img alt="ImgLogin" src={ImgLogin}></img>
            </aside>
        </div>
    </div>
);
}