import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { SeguidorModel } from "@/models/SeguidorModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointSeguir = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req?.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ erro: "Usuario logado nao encontrado!" });
      }

      const usuarioASerSeguido = await UsuarioModel.findById(id);
      if (!usuarioASerSeguido) {
        return res
          .status(400)
          .json({ erro: "Usuario a seguir não encontrado" });
      }

      const euJaSigoEsseUsuario = await SeguidorModel.find({
        usuarioSeguidorId: usuarioASerSeguido,
      });
      if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
        euJaSigoEsseUsuario.forEach(async (e: any) => {
          await SeguidorModel.findByIdAndDelete({ _id: e._id });
          usuarioLogado.seguindo--;
          await UsuarioModel.findByIdAndUpdate(
            { _id: usuarioLogado._id },
            usuarioLogado
          );
          usuarioASerSeguido.seguidores--;
          await UsuarioModel.findByIdAndUpdate(
            { _id: usuarioASerSeguido._id },
            usuarioASerSeguido
          );
        });
        return res
          .status(200)
          .json({ erro: "Deixou de ser seguido com sucesso!" });
      } else {
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioASerSeguidoId: usuarioASerSeguido._id,
        };

        await SeguidorModel.create(seguidor);

        usuarioLogado.seguindo++;

        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado._id
        );

        usuarioASerSeguido.seguidores++;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido._id
        );

        return res.status(200).json({ erro: "Usuário seguido com sucesso!" });
      }
    }
    return res.status(405).json({ erro: "Método informado não existe!" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Não foi possível seguir/deseguir o usuários!" });
  }
};

export default validarTokenJWT(conectarMongoDB(endpointSeguir));
