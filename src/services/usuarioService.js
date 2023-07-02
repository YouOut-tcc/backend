import bcrypt from "bcrypt";
import database from "../models/connection.js";

async function verifyUserExist(email){
  const sql = "select * from tbl_usuario where email=?";
  const dataLogin = [email];

  const conn = await database.connect();
  const [user] = await conn.query(sql, dataLogin);

  conn.end();
  return user
}

async function createUser(name, email, hashPass = undefined, telefone = undefined) {
  const sql =
    "insert into tbl_usuario(nome, email, hashPass, telefone) values(?,?,?,?)";
  const data = [name, email, hashPass, telefone];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function updateUser(id, name, email, password, adm) {
  const sql =
    "update tbl_usuario set nome = ?, email = ?, senha = ?, adm = ? where id = ?";
  const data = [name, email, password, adm, id];

  const conn = await database.connect();
  await conn.query(sql, data);
  conn.end();
}

async function deleteUser(id) {
  const sql = "delete from tbl_usuario where id = ?";

  const conn = await database.connect();
  await conn.query(sql, id);
  conn.end();
}

async function loginUser(email, password) {
  const user = verifyUserExist(email);

  if (!user) {
    return user;
  }

  const match = await bcrypt.compare(password, user.hashPass);

  if (match) {
    return user;
  }
  return false;
}

export default { createUser, updateUser, deleteUser, loginUser, verifyUserExist };
