import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// mudar a exteção futuramente
function imageUrlBuilder(id, placeUuid, type, imageUuid) {
  const bucket = process.env.S3_BUCKET;
  const location = process.env.S3_LOCATION;
  let path;
  if (id) {
    path = `https://${bucket}.s3.${location}.amazonaws.com/${placeUuid}/${type}/${imageUuid}-${id}.jpg`;
  } else {
    path = `https://${bucket}.s3.${location}.amazonaws.com/${placeUuid}/${type}/${imageUuid}.jpg`;
  }
  return path;
}

function imageUrlBuilderIcon(placeUuid, imageUuid) {
  const bucket = process.env.S3_BUCKET;
  const location = process.env.S3_LOCATION;
  let path;
  path = `https://${bucket}.s3.${location}.amazonaws.com/${placeUuid}/${imageUuid}.jpg`;
  return path;
}

function imageUrlBuilderCardapio(placeUuid, imageUuid) {
  const bucket = process.env.S3_BUCKET;
  const location = process.env.S3_LOCATION;
  let path;
  path = `https://${bucket}.s3.${location}.amazonaws.com/${placeUuid}/${imageUuid}-cardapio.jpg`;
  return path;
}

export {
  upload,
  imageUrlBuilder,
  imageUrlBuilderIcon,
  imageUrlBuilderCardapio,
};
