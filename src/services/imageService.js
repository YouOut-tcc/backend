import { UUID } from "mongodb";
import { s3Image } from "../connections/database.js";
import { mongodb } from "../connections/database.js";
import { v4 as uuidv4 } from "uuid";

async function saveEventImage(id, buffer, uuid, minetype) {
  let imageUuid = uuidv4();
  let path = `${uuid}/eventos/${imageUuid}-${id}.jpg`;
  console.log("indo salvar a imagem");

  await s3Image.upload(path, buffer, minetype);

  let data = {
    uuid: new UUID(imageUuid),
    type: minetype,
    size: buffer.length,
    id: id
  }

  await mongodb.insertImageMeta("eventos", uuid, data);
  console.log("talvez a imagem salvou com sucesso");
}

export {saveEventImage}