import jwt from "jsonwebtoken";
import helpers from "../helpers/helpers.js";
import database from "../models/connection.js";

async function verifyEmailExist(email, type=undefined){
	let sql;

	if(type != 'user'){
		sql = "select * from tbl_place_logins where email=?";
	} else {
		sql = "select * from tbl_usuario where email=?";
	}
  const dataLogin = [email];

  const conn = await database.connect();
  const [user] = await conn.query(sql, dataLogin);

  conn.end();
  return user
}

function verifyJWT(req, res, next){
	const secret = "dsdasdas"
	
	const token = helpers.valifyTokenFormat(req.headers);

	jwt.verify(token, secret, async (err, decoded) => {
		if(err){
			return res.status(401).send({ message: 'Usuário não autenticado' })
		}
		const user = await verifyEmailExist(decoded.infoUser.email, decoded.infoUser.userType)
		if (!user) {
			return res.status(401).send({ message: 'Usuário não existe' });
		}

		req.infoUser = decoded.infoUser;

		return next()
	})

}
export { verifyJWT }