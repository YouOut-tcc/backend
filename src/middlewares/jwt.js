import jwt from "jsonwebtoken";
import helpers from "../helpers/helpers.js";
import database from "../models/connection.js";

async function verifyEmailExist(email, type=undefined){
	let sql;

	if(type != 'user'){
		sql = "select email, parent from tbl_place_logins where email=? and deletado = 0";
	} else {
		sql = "select email from tbl_usuario where email=? and deletado = 0";
	}
  const dataLogin = [email];

  const conn = await database.connect();
  const [[user]] = await conn.query(sql, dataLogin);

  conn.end();
  return user
}

function verifyJWT(req, res, next){
	const secret = "dsdasdas"
	
	const token = helpers.valifyTokenFormat(req.headers);

	jwt.verify(token, secret, async (err, decoded) => {
		// usar try catch
		if(err){
			return res.status(401).send({ message: 'Usuário não autenticado' })
		}
		// sera que é nesscesario mantar o email do usuario, mudar isso para usar o id, talvez?
		const user = await verifyEmailExist(decoded.infoUser.email, decoded.infoUser.userType)
		if (!user) {
			return res.status(401).send({ message: 'Usuário não existe' });
		}

		if(decoded.infoUser.userType == 'place'){
			req.infoUser = decoded.infoUser;
			req.infoUser.parent = user.parent
		} else {
			req.infoUser = decoded.infoUser;
		}
		
		return next()
	})

}
export { verifyJWT }