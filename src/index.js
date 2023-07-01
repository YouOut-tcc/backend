import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const api = express();
const port = process.env.PORT;

api.use(cors());
api.use(express.json());
api.use("/", routes);

api.listen(port, () => {
  console.log(`Server is Running... on port ${port}`);
});
