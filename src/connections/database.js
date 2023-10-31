import DBMysql from "./mysql.js";

const dbmysql = new DBMysql();

console.log(`MysqlDB on ${process.env.HOST}`);

export { dbmysql };