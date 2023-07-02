import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client('649152602471-v9uc0u56ptiue3aj0snm83r5jreruphb.apps.googleusercontent.com');

function valifyTokenFormat(header) {
  const authHeader = header.authorization;
  if (!authHeader) return "TOKEN_INEXISTENTE";
  const parts = authHeader.split(" ");
  if (parts.length == 1) return "TOKEN_INVALIDO";

  const [scheme, token] = parts;
  if (scheme != "Bearer") return "TOKEN_INVALIDO";

  return token;
}

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '649152602471-v9uc0u56ptiue3aj0snm83r5jreruphb.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    return null;
  }
}

export default { valifyTokenFormat, verifyGoogleToken, parseJwt };
