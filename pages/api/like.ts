import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { error } from "console";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
const likeEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method == "PUT") {
      const { id } = req?.query;
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ erro: "Publicacao não encontrada!" });
      }

      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ erro: "Usuario não encontrada!" });
      }

      const indexUsuarioLike = publicacao.likes.findIndex(
        (e: any) => e.toString() === usuario._id.toString()
      );

      if (indexUsuarioLike != -1) {
        publicacao.likes.splice(indexUsuarioLike, 1);
        await PublicacaoModel.findById({ _id: publicacao._id }, publicacao);
        return res
          .status(200)
          .json({ msg: "Publicacao descurtida com sucesso!" });
      } else {
        publicacao.likes.push(usuario._id);
        await PublicacaoModel.findById({ _id: publicacao._id }, publicacao);
        return res.status(200).json({ msg: "Publicacao curtida com sucesso!" });
      }
    }
    return res.status(405).json({ erro: "Método inválido!" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Ocorreu um erro ao curtir ou descurtir!" });
  }
};
export default validarTokenJWT(conectarMongoDB(likeEndpoint));
