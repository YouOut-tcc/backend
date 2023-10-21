import jwt from "jsonwebtoken";

function generateToken(id, name, email, type) {
  const secret = "dsdasdas";
  return jwt.sign(
    { infoUser: { id, userName: name, email: email, userType: type } },
    secret,
    { expiresIn: 60 * 60 * 5 }
  );
}

function generateTokenResetPassword(id, type) {
  const secret = "abetterpassword";
  return jwt.sign(
    { login: { id: id, type: type } },
    secret,
    // colocar um tempo diferente
    { expiresIn: 60 * 60 * 5 }
  );
}

export { generateToken, generateTokenResetPassword };
