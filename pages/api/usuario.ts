import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import nc from "next-connect";
import { upload, uploadImageCosmic } from "../../services/uploadImagesCosmic";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { politicaCORS } from "@/middlewares/politicaCors";

const handler = nc()
  .use(upload.single("file"))
  .put(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req?.body;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ erro: "Usuario nao encontrado!" });
      }

      const { nome } = req.body;
      if (!nome || nome.lenght > 2) {
        usuario.nome = nome;
      }

      const { file } = req;
      if (!file && file.originalname) {
        const image = await uploadImageCosmic(req);
        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url;
        }
      }

      await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);
      res.status(200).json({ msg: "Usuario criado com sucesso!" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ erro: "Não foi possível atualizar usuario!" });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      return res.status(200).json("Usuario autenticado com sucess!");
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json("Não foi possível encontrar dados do usuário");
    }
  });

export const config = {
  api: {
    bodyParse: false,
  },
};
export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));
