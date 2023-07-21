import bcrypt from 'bcrypt';
import service from '../services/estabeService.js';
import { verifyJWT } from '../middlewares/jwt.js';
import { generateToken } from "../helpers/usuarioFeatures.js";
import helpers from '../helpers/helpers.js';

const saltRounds = 10;

async function placeCadastro(req, res){
  const { name, email, password, telefone } = req.body;
  let hash

  if(email == undefined || name == undefined){
    return res.status(400).send({ message: 'nome e/ou email vazios' });
  }

  if(password) {hash = await bcrypt.hash(password, saltRounds)}

  try {
    await service.createPlace(name, email, hash, telefone);
    res.status(200).send({ message: "Salvo com sucesso" });
  } catch (error) {
    if(error.code == "ER_DUP_ENTRY"){
      return res.status(500).send({ message: "Duplicate entry" });
    }
    res.status(500).send({ message: error });
  }
}

async function placeDeletar(req, res){
  const { id } = req.params;

  try {
    await service.deletePlace(id);
    res.status(200).send({message: "apagado"});
  } catch (error) {
    res.status(500).send({message: error});

  }
}

async function placeUpdate(req, res){
  const { id, name, email, password, telefone } = req.body;

  try {
    await service.updatePlace(id, name, email, password, telefone);
    res.status(200).send({ message: "Mudou com sucesso, nice" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function placeLogin(req, res){
	const {email, password} = req.body;

	try {
		const users = await service.loginPlace(email, password);
		if(users){
			const id = users.id;
			const email = users.email;
			const nome = users.nome;
			const token = generateToken(id, nome, email, 'place');

			res.status(200).send({message: 'Login efetuado com sucesso', token});
		} else {
			res.status(401).send({message: 'Login incorreto'})
		}
	} catch (error) {
		res.status(500).send({message: error})
	}
}

async function deletePlace(req, res) {
  
}

export default {
  placeCadastro,
  placeDeletar,
  placeLogin,
  placeUpdate
};
