import { UUID } from "mongodb";
import { s3Image } from "../connections/database.js";
import { mongodb } from "../connections/database.js";
import { v4 as uuidv4 } from "uuid";
import { imageUrlBuilder } from "../helpers/image.js";

async function saveEventImage(id, buffer, uuid, mimetype) {
  let imageUuid = uuidv4();
  let path = `${uuid}/eventos/${imageUuid}-${id}.jpg`;
  console.log("indo salvar a imagem");

  await s3Image.upload(path, buffer, mimetype);

  let data = {
    uuid: new UUID(imageUuid),
    type: mimetype,
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

async function updateBanners(placeUuid, data) {
  let newImagesUuid = [];
  let ordem = data.ordem;

  if(!data.imageDelete){
    console.log("sem image para apagar");
  }

  if(!data.ordem){
    console.log("não uma ordem nova");
  }

  // exite imagem novas
  if(data.newImagens.length > 0){
    let collection = mongodb.db.collection("banners");
    let placeUUID = new UUID(placeUuid); 
    let exist = await mongodb.checkIfExist(collection, placeUUID);

    data.newImagens.forEach(async (element) => {
      let uuid = uuidv4();
      newImagesUuid.push(uuid);
      let path = `${placeUuid}/banners/${uuid}.jpg`;
      console.log(element);
      let data = {
        uuid,
        type: element.mimetype,
        size: element.size,
        id_pos: parseInt(element.id_pos)
      }
      await s3Image.upload(path, element.buffer, element.mimetype);
      if(exist){
        await collection.updateOne({ uuid: placeUUID }, { $push: { imagens: data } });
      } else {
        let placeEvento = {
          uuid: placeUUID,
          imagens: [data],
        };
        exist = true;
        await collection.insertOne(placeEvento);
      }
    });
  }

  // let imageUuid = uuidv4()
  // let path = `${uuid}/eventos/${imageUuid}-${id}.jpg`;
  // console.log("indo salvar a imagem");

  // await s3Image.upload(path, buffer, mimetype);

  // let data = {
  //   uuid: new UUID(imageUuid),
  //   type: mimetype,
  //   size: buffer.length,
  //   id: id
  // }

  // await mongodb.insertImageMeta("eventos", uuid, data);
  // console.log("talvez a imagem salvou com sucesso");
}

async function getBanners(placeUuid) {
  let images = await mongodb.getImagens("banners", placeUuid);
  return images;
}

// deletar banner
// adicionar banners
// reordernar banners

export {saveEventImage, getEventImages, getBanners, updateBanners};