import { dbmysql } from '../connections/database.js';

async function verifyUUID(req, res, next){
  // se o uuid estiver anormal o server morre

  let sql = "select id, denunciado, nome, descricao, telefone, celular, numero, cep, coordenadas, criado from tbl_places where uuid=uuid_to_bin(?) and deletado = 0";
  let data = [req.params.uuid];
  // colocar um regex para verificar se tem um padrao de uuid

  let [[result]] = await dbmysql.query(sql, data);

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