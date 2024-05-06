import bcrypt from "bcrypt";
import { dbmysql } from "../connections/database.js";

async function verifyUserExist(email) {
  const sql = "select * from tbl_usuarios where email=?";
  const dataLogin = [email];

  const [[user]] = await dbmysql.query(sql, dataLogin);

  return user;
}

async function createUser(
  name,
  email,
  hashPass = undefined,
  telefone = undefined
) {
  const sql =
    "insert into tbl_usuarios(nome, email, hashPass, telefone) values(?,?,?,?)";
  const data = [name, email, hashPass, telefone];

  await dbmysql.query(sql, data);
}

async function updateUser(id, name, email, password, adm) {
  const sql =
    "update tbl_usuarios set nome = ?, email = ?, senha = ?, adm = ? where id = ?";
  const data = [name, email, password, adm, id];

  await dbmysql.query(sql, data);
}

async function deleteUser(id) {
  const sql = "delete from tbl_usuarios where id = ?";

  await dbmysql.query(sql, id);
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
      join tbl_places b on a.fk_place_id = b.id 
       left join vw_notas c on c.id = b.id
      where fk_usuario_id = ?;`;
  const data = [userid];

  const [result] = await dbmysql.query(sql, data);

  return result;
}

async function getAvaliacoes(userid) {
  const sql =
    "select * from tbl_avaliacoes where fk_usuario_id=?";
  const data = [userid];

  const [result] = await dbmysql.query(sql, data);

  return result;
}

async function getInformacoesUser(userid) {
  const sql =
    "select * from tbl_usuarios where id=?";
  const data = [userid];

  const [result] = await dbmysql.query(sql, data);

  return result;
}

async function pesquisarPlace(nome) {
  const sql = "select *, uuid_from_bin(uuid) as uuid from tbl_places where match(nome, descricao) against(?) and deletado = false;"

  const [place] = await dbmysql.query(sql, nome);

  return place;
}

async function pesquisarPlaceTag(tagId) {
  const sql = "select uuid_from_bin(uuid) as uuid, c.tag from tbl_places a join tbl_place_has_tags b join tbl_tags c on b.fk_tag_id = c.id and b.fk_place_id = a.id where c.id = ?"

  const [result] = await dbmysql.query(sql, tagId);

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
  getInformacoesUser,
  pesquisarPlace,
  pesquisarPlaceTag,
};
