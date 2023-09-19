import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import dotenv from 'dotenv';
import { validarJSON } from "./middlewares/validador.js";
dotenv.config();

const api = express();
const port = process.env.PORT;

api.use(cors());
api.use(express.json());

api.use((err, req, res, next)=>{
  console.log(err.type);
  if(err.status === 400){
    return res.status(err.status).send("cu");
  }
  return next(err);
})

api.use("/", routes);

api.listen(port, () => {
  console.log(`Server is Running... on port ${port}`);
});
