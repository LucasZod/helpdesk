import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './App'
import Ticket from './Components/Ticket/ticket';
import ListaTickets from './Components/ListaTicket/ListaTicket'
import Solicitacoes from './Components/Cadastro/Solicitacoes'
import Botoes from './Components/Botoes/Botoes'
import Liberacoes from './Components/Liberacoes/Liberacoes'
import Index from './Components/Index/Index'


ReactDOM.render(
<BrowserRouter>
     <Botoes/>
        <Switch>
            <Route path='/' exact={true} component={Home} />
            <Route path='/index' component={Index}/>
            <Route path='/ticket' component={Ticket} />
            <Route path='/lista-tickets' component={ListaTickets} />
            <Route path='/cadastro' component={Solicitacoes}/>
            <Route path='/liberacoes' component={Liberacoes}/>
        </Switch>
    </BrowserRouter>
,document.getElementById('root'));
