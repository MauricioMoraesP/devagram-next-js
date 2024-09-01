import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";

export const conectarMongoDB = (handler: NextApiHandler) => {
  return async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
  ) => {
    if (mongoose.connection.readyState) {
      return handler(req, res);
    }

    const { DB_CONEXAO_STRING } = process.env;
    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ erro: "ENV de configuração do banco não informado" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Banco de dados conectado!")
    );
    mongoose.connection.on("error", () =>
      console.log("Ocorreu um erro ao conectar no banco de dados!")
    );
    await mongoose.connect(DB_CONEXAO_STRING);

    return handler(req, res);
  };
};
