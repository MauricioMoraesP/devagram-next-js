import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import nc from "next-connect";
import { upload, uploadImageCosmic } from "@/services/uploadImagesCosmic";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { politicaCORS } from "@/middlewares/politicaCors";

const handler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ erro: "Usuário não encontrado!" });
      }

      if (req || !req.body) {
        return res
          .status(400)
          .json({ erro: "Parâmetros de entrada não informados!" });
      }

      const { descricao } = req?.body;
      if (!descricao || descricao.lenght < 2) {
        return res.status(400).json({ erro: "Descricao inválida" });
      }

      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ erro: "Imagem é obrigatória!!" });
      }

      const image = await uploadImageCosmic(req);
      const publicacao = {
        idUsuario: usuario._id,
        descricao,
        foto: image.media.url,
        data: new Date(),
      };

      usuario.publicacoes++;
      await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);

      await PublicacaoModel.create(publicacao);

      return res.status(200).json({ erro: "Publicacao criada com sucesso!" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ erro: "Erro ao cadastrar publicacao" });
    }
  });

export const config = {
  api: {
    bodyParse: false,
  },
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));
