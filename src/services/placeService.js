import database from "../models/connection.js";

// isso é um placeholder, por questoes de segurança e confiabilidade
// o service do estabelecimento não pode sequir o mesmo modelo do usuario

async function sendRequest(email) {
  const sql = "select * from tbl_place_logins where email=?";
  const dataLogin = [email];

  const conn = await database.connect();
  const [user] = await conn.query(sql, dataLogin);

  conn.end();
  return user;
}

async function createPlace(
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
  longitude
) {
  const sql =
    "insert into tbl_places(uuid,cnpj,nome_fantasia,nome,telefone,celular,numero,bairro,cidade,cep,uf,rua,latitute,longitude) values(uuid_v5(uuid(), ''),?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const data = [
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
  ];

  // TODO: em caso de duplicação do uuid, tenta de novo ate pegar um não usado

  const conn = await database.connect();
  await conn.query(sql, data);

  conn.end();
}

async function linkLogin(email, cnpj){
  const conn = await database.connect();
  let idPlace, idUser;

  let sql = "select id from tbl_places where cnpj=?";
  let data = [cnpj];
  [idPlace] = await conn.query(sql, data);

  sql = "select id from tbl_place_logins where email=?";
  data = [email];
  [idUser] = await conn.query(sql, data);

  if(idUser == undefined || idPlace == undefined){
    res.status(400).send({ message: 'id não achado'})
  }

  sql = "insert into tbl_logins_has_places(FK_place_id, FK_login_id) values(?,?)";
  data = [idPlace.id, idUser.id];
  await conn.query(sql, data);

  conn.end();
  return;
}

async function getInfo(uuid){
  const sql = "select * from tbl_places where uuid=uuid_to_bin(?)";
  const data = [uuid];

  const conn = await database.connect();
  const [result] = await conn.query(sql, data);

  conn.end();
  return result;
}

async function criarAvaliacao(comentario, nota, placeid, userid){
  const sql = "insert into tbl_avaliacoes(pontuacao,comentario,FK_place_id,FK_usuario_id) values(?,?,?,?)";
  const data = [nota,comentario,placeid,userid];

  const conn = await database.connect();
  await conn.query(sql, data);

  conn.end();
}

async function getAvaliacoes(placeid, userid){
  const sql = "select * from tbl_avaliacoes where FK_place_id=? and FK_usuario_id=?";
  const data = [placeid, userid];

  const conn = await database.connect();
  const result = await conn.query(sql, data);

  conn.end();
  return result;
}

async function criarFavorito(placeid, userid){
  const sql = "insert into tbl_favoritos(FK_place_id,FK_usuario_id) values(?,?)";
  const data = [placeid,userid];

  const conn = await database.connect();
  await conn.query(sql, data);

  conn.end();
}

export default { sendRequest, createPlace, linkLogin, getInfo, criarAvaliacao, getAvaliacoes, criarFavorito };