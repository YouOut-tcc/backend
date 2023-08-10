import jwt from "jsonwebtoken";

function generateToken(id, name, email, type) {
  const secret = "dsdasdas";
  return jwt.sign(
    { infoUser: { id, userName: name, email: email, userType: type } },
    secret,
    { expiresIn: 60 * 60 * 5 }
  );
}

export { generateToken };
