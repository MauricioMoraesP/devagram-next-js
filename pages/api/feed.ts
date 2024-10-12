import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { recordTraceEvents } from "next/dist/trace";
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
      }

      return res.status(200).json("Método informado não e valido!");
    }
    return res.status(405).json("Método inválido!");
  } catch (e) {
    console.log(e);
    return res.status(400).json("Não foi possível obter o feed");
  }
};

export default validarTokenJWT(conectarMongoDB(feedEndpoint));
