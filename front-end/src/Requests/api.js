import axios from 'axios';
import local from './local';
import {DataPrev} from '../Utils/Utils'

export async function getUsers() {
  try {
    const { data } = await axios.get(`${local}/usuarios`)
    return data;
  } catch (e) {
    console.log(e);
  }

}


export async function getDados(id){
  console.log(id);
  try{
    const {data:{resposta}} = await axios.get(`${local}/usuarios/dados/${id}`)
    return resposta;
  }catch(e){
    console.log(e);
  }
}


export async function loginUser(logar) {
  await axios.post(`${local}/usuarios/login`, logar)
    .then(res => {
      if (res.data.valid === 'OK') {
        localStorage.setItem('@usuarioHD', res.data.usuario)
        localStorage.setItem('@departamentoHD', res.data.departamento)
        localStorage.setItem('@idHD', res.data.id)
        localStorage.setItem('@tipoHD', res.data.tipo)
      }
    })
    .catch(error => {
      alert(error)
      window.location.reload();
      return;
    })

}

export async function getSolicitacoes() {
  try {
    const data = await axios.get(`${local}/solicitacoes`);
    return data;
  } catch (e) {
    console.log(e);
  }

}

export async function postSolicitacoes(dados) {
  const { nomesolicitacao, observacao } = dados;
  const newSolicitacao = { nomesolicitacao, observacao, excluido: 0 }
  try {
    const response = await axios.post(`${local}/solicitacoes/`, newSolicitacao);
    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function pathSolicitacoes(dados){
  console.log(dados);
  try{  
    const response = await axios.patch(`${local}/solicitacoes/ocultar/`, dados);
    console.log(response);
  }catch(e){
    console.log(e);
  }

}

export async function postChamado(dados) {
  
  const id = parseInt(localStorage.getItem("@idHD"));
  const { solicitacao, descricao} = dados;
  const obj = {
    id_usuario: id, id_solicitacao: solicitacao, observacao: descricao, excluido: 0, data_prevista: DataPrev(),
    data_finalizada: 0, observacao_finalizada: "Em Aberto", id_responsavel: 0, observacao_resposta: ""
  }

  console.log(obj);

  try {
    const response = await axios.post(`${local}/chamados/`, obj);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

export async function getChamados(){
  const id = parseInt(localStorage.getItem("@idHD"));
  try{
    const {data:{listaChamados}} = await axios.get(`${local}/chamados/${id}`);
    return(listaChamados);
  }catch(e){
    console.log(e);
  }
}



export async function patchChamado(id_sol, observacao, id){
  const data = {id_sol, observacao, id}
  console.log(data);
  try{
    const response = await axios.patch(`${local}/chamados/att`,data);
    console.log(response);
  }catch(e){
    console.log(e);
  }
}

export async function patchResponder(data){
  console.log(data);
  try{
    const response = await axios.patch(`${local}/chamados/res`,data);
    console.log(response);
  }catch(e){
    console.log(e);
  }
}

export async function pathAlterDate(data){
  console.log(data);
  try{
    const response = await axios.patch(`${local}/chamados/date`, data);
    console.log(response);
  }catch(e){
    console.log(e);
  }
}

export async function pathReabrir(data){
  console.log(data);
  try{
    const response = await axios.patch(`${local}/chamados/reabrir`, data);
    console.log(response);
  }catch(e){
    console.log(e);
  }
}


export async function deleteTicket(id){
  try{
  const data = await axios.delete(`${local}/chamados/${id}`)
  console.log(data);
  }catch(e){
   console.log(e);
  }
}


export async function ocultarTicket(ocultar){
  console.log(ocultar);
  try{
  const data = await axios.patch(`${local}/chamados/ocultar`, ocultar)
  console.log(data);
  }catch(e){
   console.log(e);
  }
}


export async function liberacoesButtons(){
  const idUser = parseInt(localStorage.getItem('@idHD'));
  console.log(idUser);
  try{
    const {data:{resposta}} = await axios.post(`${local}/liberacoes`, {id: idUser});
    localStorage.setItem('@S/A', resposta[0].excluido);
    localStorage.setItem('@Sol', resposta[1].excluido);
    localStorage.setItem('@Aco', resposta[2].excluido);
    localStorage.setItem('@Lib', resposta[3].excluido);
    localStorage.setItem('@Cad', resposta[4].excluido);
    localStorage.setItem('@Res', resposta[5].excluido);
    localStorage.setItem('@Atu', resposta[6].excluido);
    localStorage.setItem('@Exc', resposta[7].excluido);
  }catch(e){
    console.log(e);
    return;
  }
}

export async function liberacoesItems(id_usuario){
  try{
    const {data:{resposta}} = await axios.get(`${local}/liberacoes/${id_usuario}`);
    return resposta;
  }catch(e){
    console.log(e);
  }
}

export async function liberacoesItemsPatch(btn){

  const {id, excluido} = btn;
  const liberacoes = {id, excluido}
  console.log(liberacoes);
  try{
    const data = await axios.patch(`${local}/liberacoes/`, liberacoes);
    console.log(data);
  }catch(e){
    console.log(e);
  }
}