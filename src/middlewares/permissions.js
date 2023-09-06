import { analytics } from "googleapis/build/src/apis/analytics/index.js";
import database from "../models/connection.js";

const permissionsList = {
  CADASTRAR: 0x0000000000000001,
  // REQUEST: 0x0000000000000010,
  // REQUEST: 0x0000000000000100,
  // REQUEST: 0x0000000000001000,
}

async function isRoot(req, res, next) {
  if(req.infoUser.parent == 0){
    return next();
  }
  
  return res.status(400).send({ message: 'ação não permitida'})
}

async function getPermissions(placeid, loginid) {
  const sql = "select bin(b.permissions) permissions from tbl_place_logins a join tbl_logins_has_places b on a.id = b.FK_login_id where a.id=? and b.FK_place_id=? and deletado = 0;";
  const data = [loginid, placeid];

  const conn = await database.connect();
  const [[permissions]] = await conn.query(sql, data);

  conn.end();
  return permissions;
}

async function maskBits(bits, mask) {
  bits = parseInt(bits, 10);
  return (bits | mask) == bits;
}

async function CADASTRAR(req, res, next) {
  let permissions = await getPermissions(req.place.id, req.infoUser.id);
  if(permissions == undefined){
    return res.status(400).send({ message: 'permissoes vazias'})
  }

  if(maskBits(permissions.permissions, permissionsList.REQUEST)){
    return next();
  }
  return res.status(400).send({ message: 'sem permissao'})
}


export default {
  isRoot,
  CADASTRAR,
}