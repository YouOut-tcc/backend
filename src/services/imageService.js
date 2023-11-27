import { s3Image } from "../connections/database.js";

async function saveEventImage(name, buffer, uuid, minetype) {
  let path = `${uuid}/eventos/${name}.jpg`;
  console.log("indo salvar a imagem");
  await s3Image.upload(path, buffer, minetype);
}

export {saveEventImage}