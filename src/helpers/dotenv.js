import dotenv from "dotenv";

function setEnv() {
  dotenv.config({
    path: process.env.NODE_ENV? `.env.${process.env.NODE_ENV}` : ".env",
  });
  if(process.env.NODE_ENV == "test"){
    console.log("running on test mode")
    
  }
  console.log(`MysqlDB on ${process.env.HOST}`)
}

export { setEnv };
