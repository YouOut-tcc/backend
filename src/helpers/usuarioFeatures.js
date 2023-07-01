import jwt from 'jsonwebtoken'

function generateToken(id, name, email){
	const secret = "dsdasdas"
	return jwt.sign({infoUser: { id, userName: name, email: email }
									}, secret, {expiresIn: 60 * 60 * 5})
}

export { generateToken }