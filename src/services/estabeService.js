import bcrypt from "bcrypt";
import database from "../models/connection.js";

// isso é um placeholder, por questoes de segurança e confiabilidade
// o service do estabelecimento não pode sequir o mesmo modelo do usuario

async function verifyPlaceExist(email) {
  // verificar se o email não esta com a tag deletado
  const sql = "select * from tbl_place_logins where email=?";
  const dataLogin = [email];

  const conn = await database.connect();
  const [[user]] = await conn.query(sql, dataLogin);

  conn.end();
  return user;
}

async function createLogin(
  name,
  email,
  hashPass = undefined,
  telefone = undefined
) {
  const sql =
    "insert into tbl_place_logins(nome, email, hashPass, telefone,parent) values(?,?,?,?,?)";
  const data = [name, email, hashPass, telefone, 0];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function updateLogin(id, name, email, password, adm) {
  const sql =
    "update tbl_place_logins set nome = ?, email = ?, senha = ?, adm = ? where id = ?";
  const data = [name, email, password, adm, id];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function deleteLogin(id) {
  const sql =
    "update tbl_place_logins set deletado = true, deletado_dia = now() where id=?";

  const conn = await database.connect();
  await conn.query(sql, id);
  conn.end();
}

async function loginPlace(email, password) {
  const user = await verifyPlaceExist(email);

  if (!user) {
    return user;
  }

  const match = await bcrypt.compare(password, user.hashPass);

  if (match) {
    return user;
  }
  return false;
}

async function createLoginChild(
  name,
  email,
  parent,
  hashPass = undefined,
  telefone = undefined
) {
  const sql =
    "insert into tbl_place_logins(nome, email, hashPass, telefone, parent) values(?,?,?,?,?)";
  const data = [name, email, hashPass, telefone, parent];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function linkLogin(email, idPlace) {
  const conn = await database.connect();
  let idUser;
  let sql, data;

  sql = "select id from tbl_place_logins where email=?";
  data = [email];
  [[idUser]] = await conn.query(sql, data);

  if (idUser == undefined) {
    throw {
      message: "id invalido ou faltando",
      code: "INVALID_ID",
    };
  }

  sql =
    "insert into tbl_logins_has_places(FK_place_id, FK_login_id) values(?,?)";
  data = [idPlace, idUser.id];
  await conn.query(sql, data);

  conn.end();
  return;
}

async function updatePermissions(permissions, email) {
  let sql, data;

  
  // sql = "select id from tbl_place_logins where email=?";
  // data = [email];
  // [[idUser]] = await conn.query(sql, data);
  
  // if (idUser == undefined) {
  //   throw {
  //     message: "id invalido ou faltando",
  //     code: "INVALID_ID",
  //   };
  // }
  
  sql =
    "update tbl_logins_has_places set permissions=B? where FK_login_id=(select id from tbl_place_logins where email=?)";
  data = [permissions, email];
  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function getAllPermissions(email) {
  // mudar para usar um id em vez do email
  // colocar para mostrar o uuid?
  const sql = "select a.email, bin(b.permissions), b.FK_place_id from tbl_place_logins a join tbl_logins_has_places b on a.id = b.FK_login_id where email=? and deletado = 0;";
  const dataLogin = [email];

  const conn = await database.connect();
  const [user] = await conn.query(sql, dataLogin);

  conn.end();
  return user;
}

// initialser permissoes
// update set aspermissoes
// ver places linkados na conta
// deletar link

async function resetPassword(email) {
  
}

async function setPassword(id, hashPassword) {
  const sql = `update tbl_place_logins set hashPass = ? where id = ?`;
  const data = [hashPassword, id];

  const conn = await database.connect();
  const [user] = await conn.query(sql, data);

  conn.end();
  return user;
}

export default {
  createLogin,
  updateLogin,
  deleteLogin,
  loginPlace,
  verifyPlaceExist,
  createLoginChild,
  linkLogin,
  updatePermissions,
  getAllPermissions,
  resetPassword,
  setPassword
};
