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
    "insert into tbl_places(cnpj,nome_fantasia,telefone,celular,numero,bairro,cidade,cep,uf,rua,latitute,longitude) values(?,?,?,?,?,?,?,?,?,?,?,?)";
  const data = [
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
  ];

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

  sql = "insert into tbl_logins_has_places(FK_place_id, FK_login_id) values(?,?)";
  data = [idPlace.id, idUser.id];
  await conn.query(sql, data);

  conn.end();
  return;
}

export default { sendRequest, createPlace, linkLogin };
