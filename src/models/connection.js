import mysql2 from "mysql2/promise";
// import mariadb from "mariadb";
import dotenv from 'dotenv';
dotenv.config()

async function connect() {
  const connection = await mysql2.createConnection({
    host:     process.env.HOST,
    password: process.env.PASSWORD,
    port:     process.env.BDPORT,
    database: process.env.DATABASE,
    user:     process.env.USER,
  });

  return connection;
}

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port:     process.env.BDPORT,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 90,
  maxIdle: 90, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default { connect, pool };