import bcrypt from "bcrypt";
import { dbmysql } from "../connections/database.js";

// isso é um placeholder, por questoes de segurança e confiabilidade
// o service do estabelecimento não pode sequir o mesmo modelo do usuario

async function verifyPlaceExist(email) {
  // verificar se o email não esta com a tag deletado
  const sql = "select * from tbl_place_logins where email=?";
  const dataLogin = [email];

  const [[user]] = await dbmysql.query(sql, dataLogin);

  return user;
}

async function createLogin(
  name,
  email,
  hashPass = undefined,
  telefone = undefined
) {
  const sql =
    "insert into tbl_place_logins(nome, email, hashPass, telefone, parent) values(?,?,?,?,?)";
  const data = [name, email, hashPass, telefone, 0];

  await dbmysql.query(sql, data);
}

// dano biologico, mudar depois
async function updateLogin(id, name, email, password, adm) {
  const sql =
    "update tbl_place_logins set nome = ?, email = ?,  = ? where id = ?";
  const data = [name, email, password, adm, id];

  await dbmysql.query(sql, data);
}

async function deleteLogin(id) {
  const sql =
    "update tbl_place_logins set deletado = true, deletado_dia = now() where id=?";

  await dbmysql.query(sql, id);
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

  await dbmysql.query(sql, data);
}

async function linkLogin(email, idPlace) {
  let idUser;
  let sql, data;

  sql = "select id from tbl_place_logins where email=?";
  data = [email];
  [[idUser]] = await dbmysql.query(sql, data);

  if (idUser == undefined) {
    throw {
      message: "id invalido ou faltando",
      code: "INVALID_ID",
    };
  }

  sql =
    "insert into tbl_login_has_places(fk_place_id, fk_login_id) values(?,?)";
  data = [idPlace, idUser.id];
  await dbmysql.query(sql, data);

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
    "update tbl_login_has_places set permissoes=B? where fk_login_id=(select id from tbl_place_logins where email=?)";
  data = [permissions, email];

  await dbmysql.query(sql, data);
}

async function getAllPermissions(email) {
  // mudar para usar um id em vez do email
  // colocar para mostrar o uuid?
  const sql = "select a.email, bin(b.permissoes), b.fk_place_id from tbl_place_logins a join tbl_login_has_places b on a.id = b.fk_login_id where email=? and deletado = 0;";
  const dataLogin = [email];

  const [user] = await dbmysql.query(sql, dataLogin);

  return user;
}

async function getPlacesOwn(loginid) {
  const sql = `
  select uuid_from_bin(b.uuid) uuid, b.cnpj, b.nome_empresarial, b.nome, b.telefone, b.celular, b.icon_url, b.numero, b.cep, b.denunciado, b.denuncias, b.deletado, b.deletado_dia,
  coalesce(c.nota, 0) nota
  from tbl_login_has_places a
    join tbl_places b on b.id = a.fk_place_id
    left join vw_notas c on c.id = b.id
      where fk_login_id = ?`
  const data = [loginid]

  const [places] = await dbmysql.query(sql, data);

  return places;
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

  const [user] = await dbmysql.query(sql, data);

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
  setPassword,
  getPlacesOwn,
};
