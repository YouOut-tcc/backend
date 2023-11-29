import { UUID } from "mongodb";
import { s3Image } from "../connections/database.js";
import { mongodb } from "../connections/database.js";
import { v4 as uuidv4 } from "uuid";
import { imageUrlBuilder } from "../helpers/image.js";

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

async function getEventImages(placeUuid, eventos) {
  let result = await mongodb.getImagens("eventos", placeUuid);
  // codigo porco abaixo
  if(!result){
    return eventos;
  }
  result.imagens.forEach((elementImagens, index) => {
    eventos.forEach((elementEventos, index) => {
      if(elementEventos.id == elementImagens.id){
        let uuid = elementImagens.uuid.toString();
        let imageUrl = imageUrlBuilder(elementImagens.id, placeUuid, "eventos", uuid)
        elementEventos.image = imageUrl;
      }
    });
  });
  
  return eventos;
  // pegar todas as imagens
  // interar pelos eventos

}

export {saveEventImage, getEventImages};