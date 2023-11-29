import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// mudar a exteção futuramente
function imageUrlBuilder(id, placeUuid, type, imageUuid) {
  const bucket = process.env.S3_BUCKET;
  const location = process.env.S3_LOCATION;

  return `https://${bucket}.s3.${location}.amazonaws.com/${placeUuid}/${type}/${imageUuid}-${id}.jpg`
}

export { upload, imageUrlBuilder };