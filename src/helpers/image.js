import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function imageUrlBuilder(id, uuid, type) {
  const bucket = process.env.S3_BUCKET;
  const location = process.env.S3_LOCATION;

  return `https://${bucket}.s3.${location}.amazonaws.com/${uuid}/${type}/${id}.jpg`
}

export { upload, imageUrlBuilder };