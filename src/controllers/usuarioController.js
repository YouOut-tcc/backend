import bcrypt from 'bcrypt';
import service from '../services/usuarioService.js';
import { generateToken } from "../helpers/usuarioFeatures.js";

const saltRounds = 10;

async function usuarioCadastro(req, res){
  const { name, email, password, telefone } = req.body;
  let hash

  if(email == undefined || name == undefined){
    return res.status(400).send({ message: 'nome e/ou email vazios' });
  }

  if(password) {hash = await bcrypt.hash(password, saltRounds)}

  try {
    await service.createUser(name, email, hash, telefone);
    res.status(200).send({ message: "Salvo com sucesso" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function usuarioDeletar(req, res){
  const { id } = req.params;

  try {
    await service.deleteUser(id);
    res.status(200).send({message: "apagado"});
  } catch (error) {
    res.status(500).send({message: error});

  }
}

async function usuarioUpdate(req, res){
  const { id, name, email, password, telefone } = req.body;

  try {
    await service.updateUser(id, name, email, password, telefone);
    res.status(200).send({ message: "Mudou com sucesso, nice" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function usuarioLogin(req, res){
	const {email, password} = req.body;

	try {
		const users = await service.loginUser(email, password);
		if(users){
			const id = users.id;
			const email = users.email;
			const nome = users.nome;
			const token = generateToken(id, nome, email);

			res.status(200).send({message: 'Login efetuado com sucesso', token});
		} else {
			res.status(401).send({message: 'Login incorreto'})
		}
	} catch (error) {
		res.status(500).send({message: error})
	}
}

export default {
  usuarioCadastro,
  usuarioDeletar,
  usuarioUpdate,
  usuarioLogin,
};
