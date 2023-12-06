import { MongoClient, UUID, ServerApiVersion } from "mongodb";

const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const clusterUrl = process.env.MONGO_URL;
const authMechanism = "DEFAULT";

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/?retryWrites=true&w=majority&authMechanism=${authMechanism}`;

class DBMongodb {
  db;
  mongo;

  constructor() {
    new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
      .connect()
      .then((mongo) => {
        this.mongo = mongo;
        this.db = mongo.db(process.env.DATABASE);
      });
  }

  fistInsertImageMeta(collection, uuid, data) {
    let placeEvento = {
      uuid: uuid,
      imagens: [data],
    };
    collection.insertOne(placeEvento);
  }

  async checkIfExist(collection, uuid) {
    let result = await collection.findOne({ uuid: uuid });
    return result;
  }

  async insertImageMeta(collectionName, placeUuid, data) {
    const collection = this.db.collection(collectionName);
    const uuid = new UUID(placeUuid);
    this.checkIfExist(collection, uuid).then((result) => {
      if (result) {
        console.log("criando uma nova");
        this.insertNewImageMeta(collection, uuid, data);
      } else {
        this.fistInsertImageMeta(collection, uuid, data);
      }
    });
  }

  insertNewImageMeta(collection, uuid, data) {
    collection.updateOne({ uuid: uuid }, { $push: { imagens: data } });
  }

  // ainda não foi testado
  async updateImageMeta(collectionName, placeUuid, data, config) {
    const collection = this.db.collection(collectionName);
    const uuid = new UUID(placeUuid);
    let result = await this.checkIfExist(collection, uuid);
    if (result) {
      collection.updateOne({ uuid: uuid }, { $push: { imagens: data } });
      // collection.findOne({ uuid: uuid, "imagens.id_pos": data.id_pos }).then((result)=>{
      //   if(result){

      //   } else {
      //     collection.updateOne(
      //       { "imagens.id_pos": data.id_pos },
      //       { $set: { "imagens.$": data } }
      //     );
      //   }
      // });
    } else {
      this.fistInsertImageMeta(collection, uuid, data);
    }
  }

  // não testado
  async getImagen(collectionName, uuid) {}

  async getImagens(collectionName, placeUuid) {
    const collection = this.db.collection(collectionName);
    const uuid = new UUID(placeUuid);
    let result = await collection.findOne({ uuid: uuid });
    return result;
  }
}

export default DBMongodb;
