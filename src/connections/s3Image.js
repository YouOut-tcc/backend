import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

class S3Image {
  s3Client;
  bucketName;

  constructor(){
    this.s3Client = new S3Client({ region: process.env.S3_LOCATION });
    this.bucketName = process.env.S3_BUCKET;
  }

  async upload(path, file, mimetype){
    let params = {
      Bucket: this.bucketName,
      Key: path,
      Body: file,
      ACL: 'public-read', // Defina a permissão de acesso ao arquivo
      ContentType: mimetype,
    }
    try {
      console.log("salvando imagem, eu acho")
      let command = new PutObjectCommand(params);
      const data = await this.s3Client.send(command);
      return data;
    } catch (error) {
      console.log("erro no upload de imagem do s3");
      throw error;
    }
  }

  async getfile(path){
    let params = {
      Bucket: this.bucketName,
      Key: path,
    }

    let command = new GetObjectCommand(params);
    const data = await this.s3Client.send(command);
    return data
  }
}

export default S3Image;