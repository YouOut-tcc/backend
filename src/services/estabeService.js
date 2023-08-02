import bcrypt from "bcrypt";
import database from "../models/connection.js";

// isso é um placeholder, por questoes de segurança e confiabilidade
// o service do estabelecimento não pode sequir o mesmo modelo do usuario

async function verifyPlaceExist(email){
  const sql = "select * from tbl_place_logins where email=?";
  const dataLogin = [email];

  const conn = await database.connect();
  const [[user]] = await conn.query(sql, dataLogin);

  conn.end();
  return user
}

async function createPlace(name, email, hashPass = undefined, telefone = undefined) {
  const sql =
    "insert into tbl_place_logins(nome, email, hashPass, telefone) values(?,?,?,?)";
  const data = [name, email, hashPass, telefone];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function updatePlace(id, name, email, password, adm) {
  const sql =
    "update tbl_place_logins set nome = ?, email = ?, senha = ?, adm = ? where id = ?";
  const data = [name, email, password, adm, id];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function deletePlace(id) {
  const sql = "delete from tbl_place_logins where id = ?";

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

export default { createPlace, updatePlace, deletePlace, loginPlace, verifyPlaceExist };
