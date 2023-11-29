import DBMysql from "./mysql.js";
import S3Image from "./s3Image.js";
import DBMongodb from "./mongodb.js";

const dbmysql = new DBMysql();
console.log(`MysqlDB on ${process.env.HOST}`);
const s3Image = new S3Image();
console.log("Connecting with s3");
const mongodb = new DBMongodb();
console.log("Connecting with MongoDB");

export { dbmysql, s3Image, mongodb };