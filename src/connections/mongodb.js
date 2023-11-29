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
      }
    }).connect().then((mongo) => {
      this.mongo = mongo;
      this.db = mongo.db(process.env.DATABASE);
    });
  }

  async fistInsertImageMeta(collection, uuid, data) {
    let placeEvento = {
      uuid: uuid,
      imagens: [data],
    };
    collection.insertOne(placeEvento);
  }

  async checkIfExist(collection, uuid) {
    let result = await collection.findOne({ uuid: uuid });
    return result ? true : false;
  }

  async insertImageMeta(collectionName, placeUuid, data) {
    const collection = this.db.collection(collectionName);
    const uuid = new UUID(placeUuid);
    this.checkIfExist(collection, uuid).then(result => {
      if (result) {
        console.log("criando uma nova");
        this.insertNewImageMeta(collection, uuid, data);
      } else {
        this.fistInsertImageMeta(collection, uuid, data);
      }
    });
  }

  async insertNewImageMeta(collection, uuid, data) {
    collection.updateOne({ uuid: uuid }, { $push: { imagens: data } });
  }

  // ainda não foi testado
  async updateImageMeta(collection, uuid, data) {
    collection.updateOne(
      { uuid: uuid, "imagens.id": id },
      { $set: { "imagens.$": data } }
    );
  }
}

export default DBMongodb;
