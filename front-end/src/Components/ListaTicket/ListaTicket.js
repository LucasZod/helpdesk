import React, { useEffect, useState } from 'react'
import './listaTicket.css'
import Cards from './Cards';
import { getChamados, getSolicitacoes, patchChamado, deleteTicket, patchResponder, pathAlterDate } from '../../Requests/api';
import {DataFinalizada} from '../../Utils/Utils';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { TextField, FormGroup, Button, Paper } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles({
  root: {
    width: '100%',
  },

  inputField: {
    minWidth: 450,
    padding: 30,
  },
  paper: {
    marginBottom: 100,
    marginTop: 100
  },
  legenda:{
    textAlign: "center",
  }
});



export default function ListaTickets() {

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [lista, setLista] = useState([])
  const [bAtt, setbAtt] = useState(true);
  const [obj, setObj] = useState();
  const [SolList, setSolList] = useState([]);
  const [responder, setResponder] = useState(false);
  const [attDesc, setAttDesc] = useState(false);
  const [attData, setattData] = useState(false);

  const ADM = parseInt(localStorage.getItem('@Res'));
  const idUser = parseInt(localStorage.getItem('@idHD'));


  const columns = [
    { id: 'id_chamado', label: 'ID', minWidth: 50 },
    { id: 'login', label: 'Nome Solicitante', minWidth: 140 },
    { id: 'departamento', label: 'Departamento', minWidth: 170, align: 'right', format: (value) => value.toLocaleString('pt-BR') },
    { id: 'dataprevista', label: 'Data Prevista', minWidth: 88, align: 'right', format: (value) => value.toLocaleString('pt-BR') },
    { id: 'solicitacao', label: 'Solicitação', minWidth: 170, align: 'center' },
    { id: 'chamado', label: 'Chamado', minWidth: 170, align: 'center' },
    ADM === 1 ? 
    { id: 'atualizar', label: 'Atualizar', minWidth: 100, align: 'center' }
    : 
    { id: 'responder', label: 'Responder', minWidth: 100, align: 'center' },
    { id: 'deletar', label: 'Opções', minWidth: 100, align: 'center' }

  ]


  useEffect(() => {
    const getApi = async () => {
      const { data: { resultadoFinal } } = await getSolicitacoes();
      setSolList(resultadoFinal);
    }
    getApi();
  }, [setSolList])

  useEffect(() => {

    const getApi = async () => {
      const chamados = await getChamados();

      setLista(chamados)
    }
    getApi();
  }, [obj])



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlerbAtt = (index) => {
    setAttDesc(true);
    setResponder(false)
    setattData(false)
    const att = lista.filter((list) => (
      list.id_chamado === index
    ))

    const chamado = att[0].chamado
    const id_chamado = att[0].id_chamado
    const departamento = att[0].departamento
    const login = att[0].login
    const solicitacao = att[0].solicitacao
    const id_sol = att[0].id_solicitacao
    const data = { chamado, id_chamado, departamento, login, solicitacao, id_sol }
    setObj(data)
    if (bAtt) { setbAtt(false) } else { setbAtt(true) }
  }

  const handlerResponder = (index) => {
    setResponder(true);
    setattData(false);
    const res = lista.filter((list) => (
      list.id_chamado === index
    ))

    const chamado = res[0].chamado
    const id = res[0].id_chamado
    const login = res[0].login
    const observacao_finalizada = res[0].observacao_finalizada
    const data = { chamado, id, login, observacao_finalizada }
    setObj(data)
    if (bAtt) { setbAtt(false) } else { setbAtt(true)}
  }

  const handlerAttData = (index) =>{
    setattData(true);
    setResponder(false);

    const date = lista.filter((list) => (
      list.id_chamado === index
    ))

    const chamado = date[0].chamado
    const id = date[0].id_chamado
    const login = date[0].login
    const dataprevista = date[0].dataprevista
    const data = { chamado, id, login, dataprevista }
    setObj(data)
   

    if (bAtt) { setbAtt(false) } else { setbAtt(true)}
   }

  const handlerAtualizar = async () => {
    const { id_sol, chamado, id_chamado } = obj;
    await patchChamado(id_sol, chamado, id_chamado);
    window.location.reload()
  }

  const handlerPatchResponder = async () => {
    const { observacao_finalizada, id } = obj;
    if(observacao_finalizada === "Em Aberto"){
      alert('Você deve "Finalizar" seu chamado')
      return;
    }
    let pergunta = window.confirm('Você deseja finalizar seu chamado?')
    if(pergunta){
    const data = {observacao_finalizada, id, data_finalizada: DataFinalizada(), id_responsavel:idUser}
    await patchResponder(data);
    window.location.reload()
    }else{
      return;
    }
  }

  const handlerPatchData = async () =>{
    const {dataprevista, id} = obj;
    const qtdData = dataprevista.split('');
    if(qtdData.length > 10 || qtdData.length <10){
      alert('Formato de data inserido incorreto, format("dd/mm/aaaa")')
      return;
    }
    
    let dia = dataprevista.split("/")[0];
    let mes = dataprevista.split("/")[1];
    let ano = dataprevista.split("/")[2];
    const d = `${ano}${mes}${dia}`
    const newDate = parseInt(d);

    const data = {dataprevista: newDate, id}
    await pathAlterDate(data);
    window.location.reload();
  }

  
  const handlerDelete = async(index) =>{
   var pergunta = window.confirm('Deseja excluir esse chamado?');
   if(pergunta){
   const newList = lista.filter(item => item.id_chamado !== index)
   setLista(newList);
   await deleteTicket(index);
   }else{
     return;
   }
  }

  

  const TabelaUser = () => (
    lista.length ?
      <Paper className={classes.paper} elevation={5}>
        <TableContainer className={classes.container}>
          <Table size='small' >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      background: "black",
                      color: 'white'
                    }}

                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lista.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id_chamado}>
                    <TableCell>{row.id_chamado}</TableCell>
                    <TableCell>{row.login}</TableCell>
                    <TableCell align='right'>{row.departamento}</TableCell>
                    <TableCell align='right'>{row.dataprevista}</TableCell>
                    <TableCell align='center'>{row.solicitacao}</TableCell>
                    <TableCell align='center'>{row.chamado}</TableCell>
                    {ADM === 1 ?
                       <TableCell align='right' onClick={e => handlerbAtt(row.id_chamado)}>
                             <Button color='primary'>Atualizar</Button>
                       </TableCell>
                      :
                      <TableCell align='right' onClick={e => handlerResponder(row.id_chamado)}>
                        <Button color='secondary'>Responder</Button>
                      </TableCell>                    
                    }
                    {ADM === 1 ?
                     <TableCell align='right' onClick={e => handlerDelete(row.id_chamado)}>
                      <Button color='secondary'>Deletar</Button>
                     </TableCell>
                    :
                    <TableCell align='right' onClick={e => handlerAttData(row.id_chamado)}>
                      <Button color='secondary'>Atualizar Data</Button>
                     </TableCell>}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={lista.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      : <h1>Sem Dados</h1>
  )

  return (
    <div className="content-lista">
      <section className="lista-section">
        <Cards lista={lista} />
      </section>
      <aside className="lista-aside">
        {bAtt ? <TabelaUser /> : attDesc ?
          <Paper>
            <p className={classes.legenda}>Atualizar Descrição</p>
            <FormGroup className={classes.inputField}>
              <p>ID Chamado</p>
              <TextField
                align='center'
                placeholder="ID"
                value={obj.id_chamado}
                disabled
              />
              <p>Nome</p>
              <TextField
                align='center'
                placeholder="NOME"
                value={obj.login}
                disabled
              />
              <p>Solicitação</p>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={obj.id_sol}
                onChange={e => setObj({ ...obj, id_sol: e.target.value })}
              >
                {SolList.map((sol, index) => (
                  <MenuItem key={index} value={sol.id}>{sol.nomesolicitacao}</MenuItem>
                ))
                }
              </Select>
              <p>Descrição</p>
              <TextField
                align='center'
                placeholder="Chamado"
                value={obj.chamado}
                onChange={e => setObj({ ...obj, chamado: e.target.value })}
                multiline
                rows={4}
              />
              <Button color='secondary' onClick={handlerAtualizar}>Atualizar</Button>
              <Button onClick={() => { setbAtt(true) }}>Voltar</Button>

            </FormGroup>
          </Paper>
          : responder ?
          <Paper>
            <p className={classes.legenda}>Responder Chamado</p>
            <FormGroup className={classes.inputField}>
              <p>ID Chamado</p>
              <TextField
                align='center'
                placeholder="ID"
                value={obj.id}
                disabled
              />
              <p>Nome</p>
              <TextField
                align='center'
                placeholder="NOME"
                value={obj.login}
                disabled
              />
              <p>Descrição</p>
              <TextField
                align='center'
                placeholder="Chamado"
                value={obj.chamado}
                multiline
                disabled
                rows={2}
              />

            <p>Resposta</p>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={obj.observacao_finalizada}
                onChange={e => setObj({ ...obj, observacao_finalizada: e.target.value })}
              >
                  <MenuItem value="Em Aberto">Em aberto</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
            </Select>
              <Button color='secondary' onClick={handlerPatchResponder}>Finalizar Chamado</Button>
              <Button onClick={() => { setbAtt(true) }}>Voltar</Button>

            </FormGroup>
          </Paper>
        : attData ?
        <Paper>
          <p className={classes.legenda}>Atualizar Data</p>
            <FormGroup className={classes.inputField}>
              <p>ID Chamado</p>
              <TextField
                align='center'
                placeholder="ID"
                value={obj.id}
                disabled
              />
              <p>Nome</p>
              <TextField
                align='center'
                placeholder="NOME"
                value={obj.login}
                disabled
              />
              <p>Descrição</p>
              <TextField
                align='center'
                placeholder="Chamado"
                value={obj.chamado}
                multiline
                rows={2}
                disabled
              />
              <p>Data Prevista</p>
              <TextField
                align='center'
                placeholder="data"
                value={obj.dataprevista}
                onChange={e => setObj({ ...obj, dataprevista: e.target.value })}
              />

              <Button color='secondary' onClick={handlerPatchData}>Atualizar Data</Button>
              <Button onClick={() => { setbAtt(true) }}>Voltar</Button>

            </FormGroup>
          </Paper> : <div></div>}
      </aside>
    </div>
  );
}