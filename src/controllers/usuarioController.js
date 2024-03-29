import bcrypt from 'bcrypt';
import service from '../services/usuarioService.js';
import { verifyJWT } from '../middlewares/jwt.js';
import { generateToken } from "../helpers/tokens.js";
import helpers from '../helpers/helpers.js';

const saltRounds = 10;

async function usuarioCadastro(req, res){
  const { name, email, password, telefone } = req.body;
  let hash

  if (typeof name != "string"){
    return res.status(400).send({message: "Nome no formato inválido"})
  }
  if (name.length > 65) {
    return res.status(400).send({message: "Nome maior que o permitido"})
  }
  if (typeof email != "string"){
    return res.status(400).send({message: "Email no formato inválido"})
  }
  if (email.length > 65) {
    return res.status(400).send({message: "Email maior que o permitido"})
  }
  if (typeof telefone != "number"){
    return res.status(400).send({message: "Telefone no formato inválido"})
  }
  if (telefone.toString().length > 15) {
    return res.status(400).send({message: "Telefone maior que o permitido"})
  }
  if(email == undefined || name == undefined){
    return res.status(400).send({ message: 'nome e/ou email vazios' });
  }

  if(password) {hash = await bcrypt.hash(password, saltRounds)}

  try {
    await service.createUser(name, email, hash, telefone);
    res.status(200).send({ message: "Salvo com sucesso" });
  } catch (error) {
    if(error.code == "ER_DUP_ENTRY"){
      return res.status(500).send({ message: "Duplicate entry" });
    }
    res.status(500).send({ message: error });
  }
}

async function usuarioDeletar(req, res){
  try {
    await service.deleteUser(req.infoUser.id);
    res.status(200).send({message: "apagado"});
  } catch (error) {
    res.status(500).send({message: error});

  }
}

async function usuarioUpdate(req, res){
  const { name, email, password, telefone } = req.body;

  if (typeof name != "string"){
    return res.status(400).send({message: "Nome no formato inválido"})
  }
  if (name.length > 65) {
    return res.status(400).send({message: "Nome maior que o permitido"})
  }
  if (typeof email != "string"){
    return res.status(400).send({message: "Email no formato inválido"})
  }
  if (email.length > 65) {
    return res.status(400).send({message: "Email maior que o permitido"})
  }
  if (typeof telefone != "number"){
    return res.status(400).send({message: "Telefone no formato inválido"})
  }
  if (telefone.length > 15) {
    return res.status(400).send({message: "Telefone maior que o permitido"})
  }

  try {
    await service.updateUser(req.infoUser.id, name, email, password, telefone);
    res.status(200).send({ message: "Mudou com sucesso, nice" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function usuarioLogin(req, res){
	const {email, password} = req.body;

  if (typeof email != "string"){
    return res.status(400).send({message: "Email no formato inválido"})
  }
  if (email.length > 65) {
    return res.status(400).send({message: "Email maior que o permitido"})
  }
  if (typeof password != "string"){
    return res.status(400).send({message: "Senha no formato inválido"})
  }
  if (password.length > 1000) {
    return res.status(400).send({message: "Senha maior que o permitido"})
  }

	try {
		const users = await service.loginUser(email, password);
		if(users){
			const id = users.id;
			const email = users.email;
			const nome = users.nome;
			const token = generateToken(id, nome, email, 'user');

			res.status(200).send({message: 'Login efetuado com sucesso', token});
		} else {
			res.status(401).send({message: 'Login incorreto'})
		}
	} catch (error) {
		res.status(500).send({message: error})
	}
}

async function usuarioOauth(req, res){
	// tomar o codigo mais versatil para outros medotos de autendicação OAuth
	const token = helpers.valifyTokenFormat(req.headers);

	// mudar isso
	if(token == 'TOKEN_INVALIDO' || token == 'TOKEN_INEXISTENTE') return res.status(401).send({message: 'Token invalido ou inexistente'})

	const userInfo = await helpers.verifyGoogleToken(token);

	if(userInfo == null) return res.status(401).send({message: 'Token invalido ou inexistente'})

	const user = await service.verifyUserExist(userInfo.email);
	if(user){
		const id = user.id;
		const email = user.email;
		const nome = user.nome;
		const token = generateToken(id, nome, email, 'user');
		res.status(200).send({message: 'Login efetuado com sucesso', token});
	} else {
		const name = userInfo.given_name;
		const email = userInfo.email;
		let hash, telefone;
		try {
			await service.createUser(name, email, hash, telefone);
			res.status(200).send({ message: "Salvo com sucesso" });
		} catch (error) {
			if(error.code == "ER_DUP_ENTRY"){
				return res.status(500).send({ message: "Duplicate entry" });
			}
			res.status(500).send({ message: error });
		}
	}
}

async function usuarioToken(req, res){
	const infoUser = req.infoUser;
	const id = infoUser.id;
	const email = infoUser.email;
	const nome = infoUser.userName;
	const token = generateToken(id, nome, email, 'user');
	res.status(200).send({message: 'Login efetuado com sucesso', token});
}

async function getFavoritos(req, res) {
  try {
    let result = await service.getFavoritos(req.infoUser.id)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function getAvaliacoes(req, res) {
  try {
    let result = await service.getAvaliacoes(req.infoUser.id)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function getInformacoesUser(req, res) {
  try {
    let result = await service.getInformacoesUser(req.infoUser.id)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error})
  }
}

async function pesquisarPlace(req, res) {
  try {
    const {nome} = req.body;
    const result = await service.pesquisarPlace(nome);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({message: error});
  }
}

async function pesquisarPlaceTag(req, res) {
  try{
    const {tagId} = req.params;
    const result = await service.pesquisarPlaceTag(parseInt(tagId));
    res.status(200).send(result);
  } catch(error) {
    res.status(500).send({message: error})
  }
}

export default {
  usuarioCadastro,
  usuarioDeletar,
  usuarioUpdate,
  usuarioLogin,
  usuarioOauth,
  usuarioToken,
	getFavoritos,
	getAvaliacoes,
	getInformacoesUser,
  pesquisarPlace,
  pesquisarPlaceTag,
};
