import { analytics } from "googleapis/build/src/apis/analytics/index.js";
import database from "../models/connection.js";
import { dbmysql } from "../connections/database.js";

// isso é um placeholder, por questoes de segurança e confiabilidade
// o service do estabelecimento não pode sequir o mesmo modelo do usuario

async function sendRequest(email) {
  const sql = "select * from tbl_place_logins where email=?";
  const dataLogin = [email];

  // const conn = await database.connect();
  const [user] = await dbmysql.query(sql, dataLogin);

  // conn.end();
  return user;
}

async function createPlace(
  cnpj,
  nome_empresarial,
  nome,
  telefone,
  celular,
  numero,
  cep,
  descricao,
  latitute,
  longitude
) {
  const sql = `insert into tbl_places
      (uuid,cnpj,nome_empresarial,nome,telefone,celular,numero,cep,nota,descricao,coordenadas) 
      values(uuid_v5(uuid(), ''),?,?,?,?,?,?,?,0,?,point(?,?))`;
  const data = [
    cnpj,
    nome_empresarial,
    nome,
    telefone,
    celular,
    numero,
    cep,
    descricao,
    latitute,
    longitude,
  ];

  // TODO: em caso de duplicação do uuid, tenta de novo ate pegar um não usado

  // const conn = database.pool;
  await dbmysql.query(sql, data);

  // conn.end();
}

async function linkLogin(email, cnpj) {
  // const conn = await database.connect();
  let idPlace, idUser;

  let sql = "select id from tbl_places where cnpj=?";
  let data = [cnpj];
  [[idPlace]] = await dbmysql.query(sql, data);

  sql = "select id from tbl_place_logins where email=?";
  data = [email];
  [[idUser]] = await dbmysql.query(sql, data);

  if (idUser == undefined || idPlace == undefined) {
    throw {
      message: "id invalido ou faltando",
      code: "INVALID_ID",
    };
  }

  sql =
    "insert into tbl_login_has_places(fk_place_id, fk_login_id, permissoes) values(?,?,B'1111111111111111')";
  data = [idPlace.id, idUser.id];
  await dbmysql.query(sql, data);

  // conn.end();
  return;
}

async function getInfo(uuid) {
  // cep, se ele é favoritado, lista de comentarios, eventos, cartapio, promoçoes, cunpons
  const sql = "select * from tbl_places where uuid=uuid_to_bin(?)";
  const data = [uuid];

  // const conn = await database.connect();
  const [result] = await dbmysql.query(sql, data);

  // conn.end();
  return result;
}

async function criarAvaliacao(comentario, nota, placeid, userid) {
  const sql =
    "insert into tbl_avaliacoes(pontuacao, comentario, fk_place_id, fk_usuario_id) values(?,?,?,?)";
  const data = [nota, comentario, placeid, userid];

  // const conn = await database.connect();

  await dbmysql.query(sql, data);

  // conn.end();
}

async function getAvaliacoes(placeid, userid) {
  const sql = `select a.id id, a.denunciado ,a.pontuacao, a.comentario, a.criado, b.nome, 
  c.comentario as resposta, c.denunciado as resposta_denuncia
  from tbl_avaliacoes a
      join tbl_usuarios b on b.id = a.fk_usuario_id
      left join tbl_respostas c on fk_avaliacao_id = a.id
        where fk_place_id=?`;
  const data = [placeid, userid];

  // const conn = database.pool;
  const [result] = await dbmysql.query(sql, data);

  // conn.end();
  return result;
}

async function criarFavorito(placeid, userid) {
  const sql =
    "insert into tbl_favoritos(fk_place_id, fk_usuario_id) values(?,?)";
  const data = [placeid, userid];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function deletarFavorito(placeid, userid) {
  const sql =
    "delete from tbl_favoritos where fk_place_id = ? and fk_usuario_id = ?";
  const data = [placeid, userid];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function getFavorito(placeid, userid) {
  const sql =
    "select * from tbl_favoritos where fk_usuario_id = ? and fk_place_id = ?";
  const data = [userid, placeid];

  // const conn = await database.connect();
  let [[result]] = await dbmysql.query(sql, data);

  // conn.end();
  return result;
}

// mudar o nome dessa alies
async function favCount(placeid) {
  const sql =
    "select count(*) as qntdFavoritos from tbl_favoritos where fk_place_id = ?";
  const data = [placeid];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function getPlaces(limit, offset, location, idUser) {
  // fazer com que esse select pegue se o estabelecimento é favoritado pelo usuario: talvez fazer isso
  const sqlbackup = `select a.id, uuid_from_bin(uuid) uuid, a.nome, ST_AsGeoJSON(coordenadas) coordenadas , 
    ST_Distance_Sphere(
      coordenadas,
      point(?, ?)
    ) distancia, nota, (CASE WHEN b.fk_usuario_id is NOT NULL THEN true ELSE false END) AS favorito
    from tbl_places a left join tbl_favoritos b on b.fk_place_id = a.id
      and b.fk_usuario_id = ? where a.deletado = false order by distancia limit ? offset ?;`;

  const sql = `select a.id, a.denunciado, uuid_from_bin(uuid) uuid, a.nome, coordenadas,
      ST_Distance_Sphere(
        coordenadas,
        point(?, ?)
      ) distancia, 
      coalesce(c.nota, 0) nota, 
      (b.fk_usuario_id IS NOT NULL) favorito
      from tbl_places a
      left join vw_notas c on c.id = a.id
      left join tbl_favoritos b on b.fk_place_id = a.id
      and b.fk_usuario_id = ?
      where a.deletado = false
      order by distancia
      limit ? offset ?;`;

  // const conn = await database.connect();
  const [result] = await dbmysql.query(sql, [
    location[0],
    location[1],
    idUser,
    limit,
    offset,
  ]);

  // conn.end();
  return result;
}

async function criarEventos(descricao, inicio, fim, placeid) {
  const sql =
    "insert into tbl_eventos(descricao, inicio, fim, fk_place_id) values(?,?,?,?)";
  const data = [descricao, inicio, fim, placeid];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function getEventos(placeid) {
  const sql =
    "select descricao, inicio, fim from tbl_eventos where fk_place_id = ?";

  // const conn = await database.connect();
  const result = await dbmysql.query(sql, placeid);

  // conn.end();
  return result;
}

async function updateEventos(descricao, dt_inicio, dt_fim, eventoId) {
  const sql =
    "update tbl_eventos set descricao = ?, inicio = ?, fim = ? where id = ?";
  const data = [descricao, dt_inicio, dt_fim, eventoId];

  // const conn = await database.connect();
  dbmysql.query(sql, data);

  // conn.end();
}

async function deleteEventos(eventoId) {
  const sql = "delete from tbl_eventos where id = ?";
  // const sql = "insert into tbl_eventos(deletado) values(true) where id = ? and deletado = false";
  // const conn = await database.connect();
  dbmysql.query(sql, eventoId);

  // conn.end();
}

async function criarPromocao(placeid, dt_fim, descricao) {
  const sql =
    "insert into tbl_promocoes(fk_place_id, vencimento, descricao) values(?,?,?)";
  const data = [placeid, dt_fim, descricao];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // await conn.end();
}

async function getPromocao(placeid) {
  const sql =
    "select criado, vencimento, descricao from tbl_promocoes where fk_place_id = ?";

  // const conn = await database.connect();
  const result = dbmysql.query(sql, placeid);

  // conn.end();
  return result;
}

async function updatePromocao(dt_fim, descricao, promocaoId) {
  const sql =
    "update tbl_promocoes set vencimento = ?, descricao = ? where id = ?";
  const data = [dt_fim, descricao, promocaoId];

  // const conn = await database.connect();
  dbmysql.query(sql, data);

  // conn.end();
}

async function deletePromocao(promocaoId) {
  const sql = "delete from tbl_promocoes where id = ?";
  // const sql = "insert into tbl_promocao(deletado) values(true) where id = ? and deletado = false";
  // const conn = await database.connect();
  dbmysql.query(sql, promocaoId);

  // conn.end();
}

async function criarCupons(placeid, vencimento, descricao) {
  const sql =
    "insert into tbl_cupons(fk_place_id, vencimento, descricao) values(?,?,?)";
  const data = [placeid, vencimento, descricao];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function getCupons(placeid) {
  const sql =
    "select criacao, vencimento, descricao from tbl_cupons where fk_place_id = ?";

  // const conn = await database.connect();
  const result = dbmysql.query(sql, placeid);

  // conn.end();
  return result;
}

async function updateCupons(dt_vencimento, descricao, cupomId) {
  const sql =
    "update tbl_cupons set vencimento = ?, descricao = ? where id = ?";
  const data = [dt_vencimento, descricao, cupomId];

  // const conn = await database.connect();
  dbmysql.query(sql, data);

  // conn.end();
}

async function deleteCupons(cupomId) {
  const sql = "delete from tbl_cupons where id = ?";
  // const sql = "insert into tbl_cupons(deletado) values(true) where id = ? and deletado = false";
  // const conn = await database.connect();
  dbmysql.query(sql, cupomId);

  // conn.end();
}

async function setResposta(avaliacaoid, placeid, coment) {
  const sql =
    "Insert into tbl_respostas (fk_avaliacao_id, fk_place_logins_id, comentario) values(? ? ?)";
  const data = [avaliacaoid, placeid, coment];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function denunciarPlace(placeid, userid, motivo) {
  const sql =
    "insert into tbl_place_denuncias(fk_place_id, fk_usuario_id, motivo) values(?,?,?)";
  const data = [placeid, userid, motivo];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);
  // conn.end();
}

async function denunciarAvaliacao(avaliacaoid, userid, motivo) {
  const sql =
    "insert into tbl_avaliacao_denuncias(fk_avaliacoes_id, fk_usuario_id, motivo) values(?,?,?)";
  const data = [avaliacaoid, userid, motivo];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);
  // conn.end();
}

async function denunciarResposta(respostaid, userid, motivo) {
  const sql =
    "insert into tbl_resposta_denuncias(fk_resposta_id, fk_usuario_id, motivo) values(?,?,?)";
  const data = [respostaid, userid, motivo];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function updatePlaces(
  nome,
  nome_empresarial,
  telefone,
  celular,
  descricao,
  id
) {
  const sql =
    "update tbl_places set nome=?, nome_empresarial=?, telefone=?, celular=?, descricao=? where id = ? ";
  const data = [nome, nome_empresarial, telefone, celular, descricao, id];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);

  // conn.end();
}

async function deletarPlace(id) {
  const sql =
    "update tbl_places set deletado = true, deletado_dia = now() where id = ?";

  // const conn = await database.connect();
  await dbmysql.query(sql, id);

  // conn.end();
}

async function respoderAvaliacao(avaliacaoid, loginid, resposta) {
  const sql =
    "insert into tbl_respostas(fk_avaliacao_id, fk_place_logins_id, comentario) values(?,?,?)";
  const data = [avaliacaoid, loginid, resposta];

  // const conn = await database.connect();
  await dbmysql.query(sql, data);
  // conn.end();
}

export default {
  sendRequest,
  createPlace,
  linkLogin,
  getInfo,
  criarAvaliacao,
  getAvaliacoes,
  criarFavorito,
  deletarFavorito,
  getFavorito,
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
  denunciarPlace,
  denunciarAvaliacao,
  denunciarResposta,
  deleteCupons,
  deleteEventos,
  deletePromocao,
  deletarPlace,
  updatePlaces,
  respoderAvaliacao,
};
