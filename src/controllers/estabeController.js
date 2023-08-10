import bcrypt from 'bcrypt';
import service from '../services/estabeService.js';
import { verifyJWT } from '../middlewares/jwt.js';
import { generateToken } from "../helpers/tokens.js";
import helpers from '../helpers/helpers.js';
import {verifyEntries} from '../helpers/validation.js';
import { analytics } from 'googleapis/build/src/apis/analytics/index.js';

const saltRounds = 10;

async function placeCadastro(req, res){
  const { name, email, password, telefone } = req.body;
  let hash
  let boolTest

  boolTest = verifyEntries({name,email})

  if(boolTest){
    return res.status(400).send({ message: `${boolTest} esta vazio` });
  }

  if(password && password != "") {hash = await bcrypt.hash(password, saltRounds)}

  try {
    await service.createLogin(name, email, hash, telefone);
    res.status(200).send({ message: "Salvo com sucesso" });
  } catch (error) {
    if(error.code == "ER_DUP_ENTRY"){
      return res.status(500).send({ message: "Duplicate entry" });
    }
    res.status(500).send({ message: error });
  }
}

async function placeDeletar(req, res){
  try {
    await service.deleteLogin(req.infoUser.id);
    res.status(200).send({message: "deletado"});
  } catch (error) {
    res.status(500).send({message: error});

  }
}

async function placeUpdate(req, res){
  const { id, name, email, password, telefone } = req.body;

  try {
    await service.updateLogin(id, name, email, password, telefone);
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

async function createLoginChild(req, res) {
  const { name, email, password, telefone } = req.body;
  let hash
  let boolTest

  boolTest = verifyEntries({name,email})

  if(boolTest){
    return res.status(400).send({ message: `${boolTest} esta vazio` });
  }

  if(password && password != "") {hash = await bcrypt.hash(password, saltRounds)}

  try {
    await service.createLoginChild(name, email, req.infoUser.id, hash, telefone);
    res.status(200).send({ message: "Salvo com sucesso" });
  } catch (error) {
    if(error.code == "ER_DUP_ENTRY"){
      return res.status(500).send({ message: "Duplicate entry" });
    }
    res.status(500).send({ message: error });
  }
}

async function linkLogin(req, res) {
  const {email} = req.body;

  try {
    await service.linkLogin(email, req.place.id);
    res.status(200).send({ message: "Linkado com sucesso" });
  } catch (error) {
    if(error.code == "ER_DUP_ENTRY"){
      return res.status(500).send({ message: "Duplicate entry" });
    }
    res.status(500).send({ message: error });
  }

}


// deixar possivel ver as permissoes de outros login
async function getPermissions(req, res){
  try {
    let permissions = await service.getAllPermissions(req.infoUser.email);
    return res.status(200).send({ message: permissions });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
  
}

async function setPermissions(req, res){
  const { permissions, email } = req.body;

  try {
    await service.updatePermissions(permissions, email);
    res.status(200).send({ message: "Alterado com sucesso" });
  } catch (error) {
    if(error.code == "ER_DUP_ENTRY"){
      return res.status(500).send({ message: "Duplicate entry" });
    }
    res.status(500).send({ message: error });
  }

}

// async function getLinkedPlaces(req, res) {
  
// }


// deletar link

export default {
  placeCadastro,
  placeDeletar,
  placeLogin,
  placeUpdate,
  createLoginChild,
  linkLogin,
  setPermissions,
  getPermissions,
  // getLinkedPlaces
};
