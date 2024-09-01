import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

// eslint-disable-next-line import/no-anonymous-default-export
const endpointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;
    if (login === "admin@admin.com" && senha === "admin@123") {
      return res.status(200).json({ msg: "Usuario autenticado com sucesso!" });
    }
    return res
      .status(400)
      .json({ erro: `Usuário ou senha não encontrado ${login} ${senha}` });
  }
  return res.status(405).json({ erro: "Método informado não é valido!" });
};

export default conectarMongoDB(endpointLogin);