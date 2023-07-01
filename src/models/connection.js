// import mysql2 from "mysql2/promise";
import mariadb from "mariadb";
import dotenv from 'dotenv';
dotenv.config()

async function connect() {
  const connection = await mariadb.createConnection({
    host:     process.env.HOST,
    password: process.env.PASSWORD,
    port:     process.env.BDPORT,
    database: process.env.DATABASE,
    user:     process.env.USER,
  });

  return connection;
}

export default { connect };