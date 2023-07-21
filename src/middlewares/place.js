import database from '../models/connection.js';

async function verifyUUID(req, res, next){
  const conn = await database.connect();

  let sql = "select * from tbl_places where uuid=uuid_to_bin(?)";
  let data = [req.params.uuid];

  let [result] = await conn.query(sql, data);
  conn.end();

  if(result == undefined){
    return res.status(400).send({ message: 'place não achado'})
  }

  req.place = result;

  return next();
}

export {
  verifyUUID
}