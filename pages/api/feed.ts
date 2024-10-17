import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { recordTraceEvents } from "next/dist/trace";
import { SeguidorModel } from "@/models/SeguidorModel";
const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id);
        if (!usuario) {
          return res.status(400).json("Não foi possível encontrar o usuario");
        }
        const publicacoes = await PublicacaoModel.find({
          idUsuario: usuario._id,
        }).sort({ data: -1 });
        return res.status(200).json(publicacoes);
      } else {
        const { userId } = req.query;
        const usuarioLogado = await UsuarioModel.findById(userId);
        if (!usuarioLogado) {
          return res.status(400).json("Usuário não encontrado");
        }
        const seguidores = await SeguidorModel.findById({
          usuarioId: usuarioLogado._id,
        });

        const seguidoresIds = seguidores.map((s: any) => s.usuarioSeguidoId);
        const publicacoes = await PublicacaoModel.find({
          $or: [{ idUsuario: usuarioLogado._id }, { idUsuario: seguidoresIds }],
        }).sort({ data: -1 });

        const result = [];
        for (const publicacao of publicacoes) {
          const usuarioDaPublicacao = await UsuarioModel.findById({
            usuarioId: publicacao.idUsuario,
          });
          if (usuarioDaPublicacao) {
            const final = {
              ...publicacao,
              usuario: {
                nome: usuarioDaPublicacao.nome,
                avatar: usuarioDaPublicacao.avatar,
              },
            };
            result.push(final);
          }
        }

        return res.status(200).json(publicacoes);
      }
    }
    return res.status(405).json("Método inválido!");
  } catch (e) {
    console.log(e);
    return res.status(400).json("Não foi possível obter o feed");
  }
};

export default validarTokenJWT(conectarMongoDB(feedEndpoint));
