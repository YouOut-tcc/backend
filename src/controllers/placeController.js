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

  // fazer um helper disso
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

export default {
  requestCreation,
};
