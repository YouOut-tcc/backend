import jwt from "jsonwebtoken";

function verifyJWT(req, res, next){
	const secret = "dsdasdas"
	const authHeader = req.headers.authorization;
	if(!authHeader) return res.status(401).send({ message: 'Token não imformado.'});
	const parts = authHeader.split(' ')
	if(parts.length !== 1) return res.status(401).send({ message: 'Token inválido.'});

	const [scheme, token] = parts;
	if(!/^Bearer$/i.test(scheme)) return res.status(401).send({ message: 'Token inválido' });
	jwt.verify(token, secret, (err, decoded) => {
		if(err){
			return res.status(401).send({ message: 'Usuário não autenticado' })
		}
		req.infoUser = decoded.infoUser;
		return next()
	})

}
export { verifyJWT }