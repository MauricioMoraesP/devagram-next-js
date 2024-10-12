import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId } = req?.query;
    const usuario = await UsuarioModel.findById(userId);
    return res.status(200).json("Usuario autenticado com sucess!");
  } catch (e) {
    console.log(e);
    return res.status(400).json("Não foi possível encontrar dados do usuário");
  }
};

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));
