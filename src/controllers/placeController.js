import service from "../services/placeService.js";
import { isJSONEntriesNullorEmpty } from "../helpers/validation.js"; 

async function requestCreation(req, res) {
  const {
    cnpj,
    nome_fantasia,
    nome,
    telefone,
    celular,
    numero,
    bairro,
    cidade,
    cep,
    uf,
    rua,
    latitute,
    longitude,
  } = req.body;

  let boolTest = isJSONEntriesNullorEmpty({
    cnpj,
    nome_fantasia,
    nome,
    telefone,
    celular,
    numero,
    bairro,
    cidade,
    cep,
    uf,
    rua,
    latitute,
    longitude,
  })

  if(boolTest){
    return res.status(400).send({ message: `${boolTest} esta faltando`})
  }

  // validar dados

  // codigo placeholder
  // criar place

  try {
    await service.createPlace(
      cnpj,
      nome_fantasia,
      nome,
      telefone,
      celular,
      numero,
      bairro,
      cidade,
      cep,
      uf,
      rua,
      latitute,
      longitude,
    )
    await service.linkLogin(req.infoUser.email, cnpj)
    res.status(200).send({ message: "Salvo"})
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }

  // enviar request para um email ou sistema
  // message de sucesso ou falha

}

function showInfo(req, res){
  return res.status(200).send({message: req.place})
}

async function avaliarPlace(req, res){
  const {comentario, nota} = req.body;

  if(comentario == undefined || nota == undefined){
    return res.status(400).send({ message: "Invalido, falta imformaçao"})
  }

  if(typeof nota != 'number'){
    return res.status(400).send({ message: "Invalido, nota não é uma numero"})
  }

  if(nota < 0 || nota > 5){
    return res.status(400).send({ message: "Invalido, nota vai de 0 á 5"})
  }

  try {
    await service.criarAvaliacao(comentario, nota, req.place.id, req.infoUser.id)
    res.status(200).send({ message: "Salvo"})
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

// TODO: tirar as FK do resultado
async function getAvaliacoes(req, res) {
  try {
    let result = await service.getAvaliacoes(req.place.id, req.infoUser.id)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function criarFavorito(req, res) {
  try {
    await service.criarFavorito(req.place.id, req.infoUser.id)
    res.status(200).send({ message: "Salvo"})
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function favCount(req, res) {
  try {
    await service.favCount(req.place.id)
    res.status(200).send({ message: "Concluido"})
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function getPlaces(req, res) {
  console.log(req.query)
  try {
    let result = await service.getAllPlaces()
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function criarEventos(req, res){
  const {descricao, inicio, fim} = req.body;
  try{
    await service.criarEventos(descricao, inicio, fim, req.place.id);
    res.status(200).send({message: "Evento criado"});
  } catch(error) {
    res.status(400).send({message: error});
  }
}

async function getEventos(req, res){
  try{
    const [result] = await service.getEventos(req.place.id);
    res.status(200).send(result);
  } catch(error){
    res.status(400).send({Message: error})
  }
}

async function criarPromocao(req, res){
  const {dt_fim, descricao} = req.body;
  try{
    await service.criarPromocao(req.place.id, dt_fim, descricao);
    res.status(200).send({message: "Promoção criada"});
  } catch(error) {
    res.status(400).send({message: error})
  }
}

async function getPromocao(req, res){
  try{
    const [result] = await service.getPromocao(req.place.id);
    res.status(200).send(result);
  } catch(error) {
    res.status(400).send({Message: error})
  }
}

async function criarCupons(req, res) {
  const {vencimento, descricao} = req.body;
  try{
    await service.criarCupons(req.place.id, vencimento, descricao);
    res.status(200).send({message: "Cupon criado com sucesso"});
  } catch(error) {
    res.status(400).send({Message: error});
  }
}

async function getCupons(req, res) {
  try {
  const [result] = await service.getCupons(req.place.id);
  res.status(200).send(result)
  } catch(error) {
    res.status(400).send({Message: error})
  }
}

export default {
  requestCreation,
  showInfo,
  avaliarPlace,
  getAvaliacoes,
  criarFavorito,
  favCount,
  getPlaces,
  criarEventos,
  criarPromocao,
  criarCupons,
  getEventos,
  getCupons,
  getPromocao,
};
