import database from '../models/connection.js';

async function verifyUUID(req, res, next){
  // se o uuid estiver anormal o server morre
  const conn = database.pool;

  let sql = "select id, nome, telefone, celular, numero, cep, longitude, latitute, criado from tbl_places where uuid=uuid_to_bin(?) and deletado = 0";
  let data = [req.params.uuid];
  // colocar um regex para verificar se tem um padrao de uuid

  let [[result]] = await conn.query(sql, data);
  // conn.end();

  if(result == undefined){
    return res.status(400).send({ message: 'place não achado'})
  }

  req.place = result;
  req.place.uuid = req.params.uuid;

  return next();
}

export {
  verifyUUID
}