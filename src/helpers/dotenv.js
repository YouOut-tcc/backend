import dotenv from "dotenv";

if(process.env.ENV){
  dotenv.config({
    path: process.env.ENV,
  });
} else {
  dotenv.config({
    path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
  });
}

if (process.env.NODE_ENV == "test") {
  console.log("running on test mode");
}
