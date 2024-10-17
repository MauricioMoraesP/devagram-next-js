import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import NextCors from "nextjs-cors";
export const politicaCORS = (handler: NextApiHandler) => {
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        origin: "*",
        methods: ["PUT", "POST", "GET"],
        optionsSucessStatus: true,
      });

      return handler(req, res);
    } catch (e) {
      console.log("Erro ao tratar a política de CORS: ", e);
      res
        .status(500)
        .send({ erro: "Ocorreu erro ao tratar a política de CORS!" });
    }
  };
};
