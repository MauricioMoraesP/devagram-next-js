import multer from "multer";
import cosmicjs from "cosmicjs";
const {
  BUCKET_SLUG_AVATARES,
  WRITE_KEY_AVATARES,
  BUCKET_SLUG_POST,
  WRITE_KEY_POST,
} = process.env;

const Cosmic = cosmicjs();
const bucketAvateres = Cosmic.bucket({
  slug: BUCKET_SLUG_AVATARES,
  write_key: WRITE_KEY_AVATARES,
});

const bucketPublicacoes = Cosmic.bucket({
  slug: BUCKET_SLUG_POST,
  write_key: WRITE_KEY_POST,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

const uploadImageCosmic = async (req: any) => {
  if (req?.file?.originalname) {
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };

    if (req.url && req.url.includes("publicacao")) {
      return await bucketPublicacoes.addMedia({ media: media_object });
    } else {
    }
  }
};

export { upload, uploadImageCosmic };
