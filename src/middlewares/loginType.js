function verifyifPlace(req, res, next){
  if(req.infoUser.userType == 'place'){
    return next();
  }
  
  return res.status(400).send({ message: 'login tipo user'})
}

function verifyifUser(req, res, next){
  if(req.infoUser.userType == 'user'){
    return next();
  }
  
  return res.status(400).send({ message: 'login tipo place'})
}

export {
  verifyifPlace,
  verifyifUser
}