import mysql2 from "mysql2/promise";
// import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config();

class DBMysql {
  pool = undefined;
  usePool = true;
  onTest = false;
  connTest = undefined;

  constructor() {
    this.onTest = process.env.NODE_ENV == "test" ? true : false;

    this.pool = mysql2.createPool({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: process.env.BDPORT,
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 50,
      maxIdle: 50, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  }

  async setTestConnection(){
    this.connTest = await mysql2.createConnection({
      host:     process.env.HOST,
      password: process.env.PASSWORD,
      port:     process.env.BDPORT,
      database: process.env.DATABASE,
      user:     process.env.USER,
    });
  }

  async querysafe(query, data) {
    const conn = this.pool;
    let result;

    try {
      await conn.beginTransaction();

      result = await conn.query(query, data);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      return result;
    }
  }

  async querynotsafe(query, data) {
    const conn = this.pool;
    return conn.query(query, data);
  }

  async querytest(query, data) {
    let result = await this.connTest.query(query, data);
    return result;
  }

  async query(query, data = undefined, safe = false) {
    let result;
    if (this.onTest) {
      result = await this.querytest(query, data);
    } else if (safe) {
      result = await this.querysafe(query, data);
    } else {
      result = await this.querynotsafe(query, data);
    }
    
    return result;
  }

  multiquery(querys, datas) {}

  endTest(){
    this.connTest.rollback();
    this.connTest.end();
  }

  close() {
    this.pool.end();
  }
}

export default DBMysql;
