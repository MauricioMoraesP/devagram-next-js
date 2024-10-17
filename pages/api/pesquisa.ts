import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { politicaCORS } from "@/middlewares/politicaCors";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const pesquisaEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any[]>
) => {
  try {
    if (req.method === "GET") {
      if (req.query.id) {
        const usuarioEncontrado = await UsuarioModel.findById(req.query.id);
        if (!usuarioEncontrado) {
          return res.status(404).json({
            erro: "Usuário não encontrado!",
          });
        }
        return res.status(200).json(usuarioEncontrado);
      }

      const { filtro } = req.query;

      if (filtro && typeof filtro === "string" && filtro.length < 2) {
        return res.status(400).json({
          erro: "Favor informar pelo menos 2 caracteres para a busca!",
        });
      }

      const usuariosEncontrados = await UsuarioModel.find({
        $or: [{ nome: { $regex: filtro, $options: "i" } }],
      });

      return res.status(200).json(usuariosEncontrados);
    }

    return res.status(405).json({ erro: "Método inválido!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ erro: "Não foi possível buscar usuários!" });
  }
};

export default politicaCORS(conectarMongoDB(validarTokenJWT(pesquisaEndpoint)));
