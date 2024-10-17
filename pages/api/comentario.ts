import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { recordTraceEvents } from "next/dist/trace";
import { SeguidorModel } from "@/models/SeguidorModel";

const comentarioEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ erro: "Usuario não encontrado!" });
      }
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ erro: "Publicacao nao encontrada!" });
      }

      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        return res.status(400).json({ erro: "Comentário inválido!" });
      }

      const comentario = {
        usuarioId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        comentario: req.body.comentario,
      };
      publicacao.comentarios.push(comentario);

      await PublicacaoModel.findByIdAndUpdate(
        { _id: publicacao._id },
        publicacao
      );
      return res.status(200).json({ msg: "Comentário realizado!" });
    }

    return res.status(405).json("Método inválido!");
  } catch (e) {
    console.log(e);
    return res.status(500).json("Ocorreu erro ao adicionar o comentário!");
  }
};
export default validarTokenJWT(conectarMongoDB(comentarioEndpoint));
