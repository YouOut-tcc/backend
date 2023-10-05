import bcrypt from "bcrypt";
import database from "../models/connection.js";

async function verifyUserExist(email) {
  const sql = "select * from tbl_usuario where email=?";
  const dataLogin = [email];

  const conn = await database.connect();
  const [[user]] = await conn.query(sql, dataLogin);

  conn.end();
  return user;
}

async function createUser(
  name,
  email,
  hashPass = undefined,
  telefone = undefined
) {
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
  const user = await verifyUserExist(email);

  if (!user) {
    return user;
  }

  const match = await bcrypt.compare(password, user.hashPass);

  if (match) {
    return user;
  }
  return false;
}

// {
//   "uuid": "8f243d99-022b-521b-a2e5-b4d061a299bb",
//   "nome": "padaria do seu ze",
//   "coordenadas": [
//     -23.62389805386137,
//     -46.81348113399987
//   ],
//   "distancia": 5689748.946719416,
//   "nota": "0.0"
// },

async function getFavoritos(userid) {
  const sql =
    `select uuid_from_bin(b.uuid) uuid, b.denunciado, b.nome nome, b.coordenadas coordenadas, a.criado criado,
    ST_Distance_Sphere(
          coordenadas,
          point(0, 0)
        ) distancia,
        coalesce(c.nota, 0) nota
      from tbl_favoritos a 
      join tbl_places b on a.FK_place_id = b.id 
       left join vw_notas c on c.id = b.id
      where FK_usuario_id = ?;`;
  const data = [userid];

  const conn = await database.connect();
  const [result] = await conn.query(sql, data);

  conn.end();
  return result;
}

async function getAvaliacoes(userid) {
  const sql =
    "select * from tbl_avaliacoes where FK_usuario_id=?";
  const data = [userid];

  const conn = await database.connect();
  const [result] = await conn.query(sql, data);

  conn.end();
  return result;
}

async function getInformacoesUser(userid) {
  const sql =
    "select * from tbl_usuario where id=?";
  const data = [userid];

  const conn = await database.connect();
  const [result] = await conn.query(sql, data);

  conn.end();
  return result;
}

export default {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  verifyUserExist,
  getFavoritos,
  getAvaliacoes,
  getInformacoesUser
};
