import DBMysql from "./mysql.js";
import S3Image from "./s3Image.js";

const dbmysql = new DBMysql();
const s3Image = new S3Image();

console.log(`MysqlDB on ${process.env.HOST}`);

export { dbmysql, s3Image };