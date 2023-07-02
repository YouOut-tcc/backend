import jwt from "jsonwebtoken";
import helpers from "../helpers/helpers.js";

function verifyJWT(req, res, next){
	const secret = "dsdasdas"
	
	const token = helpers.valifyTokenFormat(req.headers);

	jwt.verify(token, secret, (err, decoded) => {
		if(err){
			return res.status(401).send({ message: 'Usuário não autenticado' })
		}
		req.infoUser = decoded.infoUser;
		return next()
	})

}
export { verifyJWT }