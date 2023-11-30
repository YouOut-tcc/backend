import service from "../services/placeService.js";
import { isJSONEntriesNullorEmpty } from "../helpers/validation.js";
import { saveEventImage, getEventImages } from "../services/imageService.js";
import { imageUrlBuilder } from "../helpers/image.js";

async function requestCreation(req, res) {
  const {
    cnpj,
    nome_empresarial,
    nome,
    telefone,
    celular,
    numero,
    cep,
    descricao,
    latitude,
    longitude,
  } = req.body;

  if (typeof nome_empresarial != "string") {
    return res
      .status(400)
      .send({ message: "Nome empresarial no formato inválido" });
  }
  if (nome_empresarial.length > 255) {
    return res
      .status(400)
      .send({ message: "Nome empresarial maior que o tamanho permitido" });
  }
  if (typeof nome != "string") {
    return res.status(400).send({ message: "Nome no formato inválido" });
  }
  if (nome.length > 255) {
    return res
      .status(400)
      .send({ message: "Nome maior que o tamanho permitido" });
  }
  if (typeof telefone != "string") {
    return res.status(400).send({ message: "telefone no formato inválido" });
  }
  if (telefone.length > 20) {
    return res
      .status(400)
      .send({ message: "Telefone maior que o tamanho permitido" });
  }
  if (typeof celular != "string") {
    return res.status(400).send({ message: "Celular no formato inválido" });
  }
  if (celular.length > 20) {
    return res
      .status(400)
      .send({ message: "Celular maior que o tamanho permitido" });
  }
  if (typeof numero != "string") {
    return res.status(400).send({ message: "Número no formato inválido" });
  }
  if (numero.length > 32) {
    return res
      .status(400)
      .send({ message: "Numero maior que o tamanho permitido" });
  }
  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Descrição no formato inválido" });
  }

  let boolTest = isJSONEntriesNullorEmpty({
    cnpj,
    nome_empresarial,
    nome,
    telefone,
    celular,
    numero,
    cep,
    descricao,
    latitude: latitude,
    longitude,
  });

  if (boolTest) {
    return res.status(400).send({ message: `${boolTest} esta faltando` });
  }

  // validar dados

  // codigo placeholder
  // criar place

  try {
    await service.createPlace(
      cnpj,
      nome_empresarial,
      nome,
      telefone,
      celular,
      numero,
      cep,
      descricao,
      latitude,
      longitude
    );
    await service.linkLogin(req.infoUser.email, cnpj);
    return res.status(200).send({ message: "Salvo" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error });
  }

  // enviar request para um email ou sistema
  // message de sucesso ou falha
}

function showInfo(req, res) {
  return res.status(200).send(req.place);
}

async function avaliarPlace(req, res) {
  const { comentario, nota } = req.body;

  if (comentario == undefined || nota == undefined) {
    return res.status(400).send({ message: "Invalido, falta imformaçao" });
  }

  if (typeof nota != "number") {
    return res.status(400).send({ message: "Invalido, nota não é uma numero" });
  }

  if (typeof comentario != "string") {
    return res
      .status(400)
      .send({ message: "Inválido, comentário não está no formato string" });
  }

  if (comentario.length > 255) {
    return res.status(400).send({
      message: "Tamanho do comentário é maior que o limite permitido",
    });
  }

  if (nota < 0 || nota > 5) {
    return res.status(400).send({ message: "Invalido, nota vai de 0 á 5" });
  }

  try {
    await service.criarAvaliacao(
      comentario,
      nota,
      req.place.id,
      req.infoUser.id
    );
    res.status(200).send({ message: "Salvo" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

// TODO: tirar as FK do resultado
async function getAvaliacoes(req, res) {
  try {
    let result = await service.getAvaliacoes(req.place.id, req.infoUser.id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function criarFavorito(req, res) {
  try {
    await service.criarFavorito(req.place.id, req.infoUser.id);
    res.status(200).send({ message: "Salvo" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function deletarFavorito(req, res) {
  try {
    await service.deletarFavorito(req.place.id, req.infoUser.id);
    res.status(200).send({ message: "Apagado" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function getFavorito(req, res) {
  try {
    let result = await service.getFavorito(req.place.id, req.infoUser.id);
    let message = result ? true : false;
    res.status(200).send({ message: message });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function favCount(req, res) {
  try {
    await service.favCount(req.place.id);
    res.status(200).send({ message: "Concluido" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function getPlaces(req, res) {
  // console.log(req.query)
  let page = parseInt(req.query.page) || 0;
  let location = [req.query.latitute || 0, req.query.longitude || 0];
  const limit = 20;

  page = page * limit;
  console.log(location);

  try {
    let result = await service.getPlaces(
      limit,
      page,
      location,
      req.infoUser.id
    );
    res.status(200).send(result);
  } catch (error) {
    console.log(error.constructor.name);
    if (error instanceof SyntaxError) {
      console.log(error.message);
      return res
        .status(500)
        .send({ message: "error com o json parser, talvez" });
    }
    return res.status(400).send({ message: error });
  }
}

// olhar o minetype para não ser carregado algo fora de uma imagem
// medo de ser possivel dar upload de algo fora de uma imagem
// corrigir a data, backend e frontend
async function criarEventos(req, res) {
  let { nome, descricao, valor, inicio, fim } = req.body;
  const { buffer, mimetype } = req.file;

  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Formato de descrição inválido" });
  }
  if (descricao.length > 150) {
    return res
      .status(400)
      .send({ message: "Tamanho da descrição é maior que o limite permitido" });
  }
  valor = parseFloat(valor);

  // console.log({ nome, descricao, valor, inicio, fim });

  try {
    let [result] = await service.criarEventos(nome, descricao, valor, inicio, fim, req.place.id);
    let id = result.insertId;

    //salva no s3
    await saveEventImage(id, buffer, req.place.uuid, mimetype);
    res.status(200).send({ message: "Evento criado" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function getEventos(req, res) {
  try {
    const uuid = req.place.uuid;
    const [result] = await service.getEventos(req.place.id);
    // retomar a url da imagem, no momento irei fazer de um jeito porco
    // mudar para usar o sistema do s3 em vez de pegar no seco
    // quando mudar isso, configurar certo o s3 para não permitir acesso publico

    // dessa forma o backend retona urls invalidas
    // result.forEach(element => {
    //   element.image = imageUrlBuilder(element.id, req.place.uuid, "eventos");
    // });

    getEventImages(uuid, result).then((eventos) => {
      res.status(200).send(eventos);
    });
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function updateEventos(req, res) {
  const { descricao, dt_inicio, dt_fim, eventoId } = req.body;
  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Formato de descrição inválido" });
  }
  if (descricao.length > 150) {
    return res
      .status(400)
      .send({ message: "Tamanho da descrição é maior que o limite permitido" });
  }
  if (typeof eventoId != "number") {
    return res.status(400).send({ message: "id inválido" });
  }
  try {
    await service.updateEventos(descricao, dt_inicio, dt_fim, eventoId);
    res.status(200).send({ message: "Dados atualizados" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function deleteEventos(req, res) {
  try {
    const { eventoId } = req.params;
    await service.deleteEventos(parseInt(eventoId));
    res.status(200).send({ message: "Apagado" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function criarPromocao(req, res) {
  const { dt_fim, descricao } = req.body;
  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Formato de descrição inválido" });
  }
  if (descricao.length > 150) {
    return res
      .status(400)
      .send({ message: "Tamanho da descrição é maior que o limite permitido" });
  }
  try {
    await service.criarPromocao(req.place.id, dt_fim, descricao);
    res.status(200).send({ message: "Promoção criada" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function getPromocao(req, res) {
  try {
    const [result] = await service.getPromocao(req.place.id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function updatePromocao(req, res) {
  const { dt_fim, descricao, promocaoId } = req.body;
  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Formato de descrição inválido" });
  }
  if (descricao.length > 150) {
    return res
      .status(400)
      .send({ message: "Tamanho da descrição é maior que o limite permitido" });
  }
  if (typeof promocaoId != "number") {
    return res.status(400).send({ message: "id inválido" });
  }
  try {
    await service.updatePromocao(dt_fim, descricao, promocaoId);
    res.status(200).send({ message: "Dados atualizados" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function deletePromocao(req, res) {
  try {
    const { promocaoId } = req.params;
    await service.deletePromocao(parseInt(promocaoId));
    res.status(200).send({ message: "Apagado" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function criarCupons(req, res) {
  const { vencimento, descricao } = req.body;
  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Formato de descrição inválido" });
  }
  if (descricao.length > 30) {
    return res
      .status(400)
      .send({ message: "Tamanho da descrição é maior que o limite permitido" });
  }
  try {
    await service.criarCupons(req.place.id, vencimento, descricao);
    res.status(200).send({ message: "Cupon criado com sucesso" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function getCupons(req, res) {
  try {
    const [result] = await service.getCupons(req.place.id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function updateCupons(req, res) {
  const { dt_vencimento, descricao, cupomId } = req.body;
  if (typeof descricao != "string") {
    return res.status(400).send({ message: "Formato de descrição inválido" });
  }
  if (descricao.length > 30) {
    return res
      .status(400)
      .send({ message: "Tamanho da descrição é maior que o limite permitido" });
  }
  if (typeof cupomId != "number") {
    return res.status(400).send({ message: "id inválido" });
  }
  try {
    await service.updateCupons(dt_vencimento, descricao, cupomId);
    res.status(200).send({ message: "Dados atualizados" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function deleteCupons(req, res) {
  try {
    const { cupomId } = req.params;
    await service.deleteCupons(parseInt(cupomId));
    res.status(200).send({ message: "deletado" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

async function denunciarAvaliacao(req, res) {
  const { motivo } = req.body;
  const avaliacaoid = req.params.id;
  const userid = req.infoUser.id;
  try {
    await service.denunciarAvaliacao(avaliacaoid, userid, motivo);
    res.status(200).send({ message: "Denunciado" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function denunciarResposta(req, res) {
  const { motivo } = req.body;
  const respostaid = req.params.id;
  const userid = req.infoUser.id;
  try {
    await service.denunciarResposta(respostaid, userid, motivo);
    res.status(200).send({ message: "Denunciado" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function denunciarPlace(req, res) {
  const { motivo } = req.body;
  const placeid = req.place.id;
  const userid = req.infoUser.id;
  try {
    await service.denunciarPlace(placeid, userid, motivo);
    res.status(200).send({ message: "Denunciado" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
}

async function deletarPlace(req, res) {
  try {
    await service.deletarPlace(req.place.id);
    res.status(200).send({ message: "deletado" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function updatePlaces(req, res) {
  try {
    const { nome, nome_empresarial, telefone, celular, descricao } = req.body;

    await service.updatePlaces(
      nome,
      nome_empresarial,
      telefone,
      celular,
      descricao,
      req.place.id
    );
    res.status().send({ message: "Dados atualizados" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function respoderAvaliacao(req, res) {
  try {
    const { resposta } = req.body;
    const { id } = req.params;

    await service.respoderAvaliacao(id, req.infoUser.id, resposta);
    res.status(200).send({ message: "Salvo" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

export default {
  requestCreation,
  showInfo,
  avaliarPlace,
  getAvaliacoes,
  criarFavorito,
  getFavorito,
  deletarFavorito,
  favCount,
  getPlaces,
  criarEventos,
  criarPromocao,
  criarCupons,
  getEventos,
  getCupons,
  getPromocao,
  updatePromocao,
  updateEventos,
  updateCupons,
  deleteCupons,
  deleteEventos,
  deletePromocao,
  denunciarPlace,
  denunciarAvaliacao,
  denunciarResposta,
  deletarPlace,
  updatePlaces,
  respoderAvaliacao,
};
