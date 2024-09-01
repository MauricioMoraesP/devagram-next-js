import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "@/models/UsuarioModel";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { LoginResposta } from "@/types/LoginResposta";

// eslint-disable-next-line import/no-anonymous-default-export
const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
  if (req.method === "POST") {
    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
      return res.status(500).json({ erro: `ENV Jwt não informado!` });
    }
    const { login, senha } = req.body;
    const usuariosEncontrado = await UsuarioModel.find({
      email: login,
      senha: md5(senha),
    });
    if (usuariosEncontrado && usuariosEncontrado.length > 0) {
      const usuarioEncontrado = usuariosEncontrado[0];
      const token = jwt.sign({ _id: usuarioEncontrado._id }, MINHA_CHAVE_JWT);
      return res.status(200).json({
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        token: token,
      });
    }
    return res.status(400).json({ erro: `Usuário ou senha não encontrado!` });
  }
  return res.status(405).json({ erro: "Método informado não é valido!" });
};

export default conectarMongoDB(endpointLogin);
