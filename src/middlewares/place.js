import { dbmysql } from '../connections/database.js';
import { imageUrlBuilderIcon } from '../helpers/image.js';

async function verifyUUID(req, res, next){
  // se o uuid estiver anormal o server morre

  let sql = `select a.id, icon_url, denunciado, nome, descricao, telefone, celular, numero, cep, coordenadas, criado,
  coalesce(c.nota, 0) nota
  from tbl_places a
  left join vw_notas c on c.id = a.id 
  where uuid=uuid_to_bin(?) and deletado = 0`;
  let data = [req.params.uuid];
  // colocar um regex para verificar se tem um padrao de uuid

  let [[result]] = await dbmysql.query(sql, data);

  if(result == undefined){
    return res.status(400).send({ message: 'place não achado'})
  }

  req.place = result;
  req.place.uuid = req.params.uuid;
  if(result.icon_url){
    req.place.icon_url = imageUrlBuilderIcon(req.params.uuid, result.icon_url);
  }

  return next();
}

export {
  verifyUUID
}