import service from "../services/placeService.js";

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

  // fazer um helper disso?
  let elements = Object.entries({
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

  let boolTeste = elements.findIndex((x) => x[1] == undefined)

  if(boolTeste != -1){
    res.status(400).send({ message: `${elements[boolTeste][0]} esta faltando`})
    return
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

export default {
  requestCreation,
  showInfo,
  avaliarPlace,
  getAvaliacoes,
  criarFavorito
};
