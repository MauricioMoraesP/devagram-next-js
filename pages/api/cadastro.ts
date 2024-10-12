import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "../../models/UsuarioModel";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import md5 from "md5";
import { upload, uploadImageCosmic } from "../../services/uploadImagesCosmic";
import nc from "next-connect";
const handler = nc()
  .use(upload.single("file"))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      const usuario = req.body as CadastroRequisicao;
      if (!usuario.nome || usuario.nome.length < 2) {
        return res.status(400).json({ erro: "Nome invalido!" });
      }
      if (
        !usuario.email ||
        usuario.email.length < 5 ||
        !usuario.email.includes("@") ||
        !usuario.email.includes(".")
      ) {
        return res.status(400).json({ erro: "E-mail invalido!" });
      }
      if (!usuario.senha || usuario.senha.length < 4) {
        return res.status(400).json({ erro: "Senha invalido!" });
      }

      const usuarioComMesmoEmail = await UsuarioModel.find({
        email: usuario.email,
      });
      if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
        return res
          .status(400)
          .json({ erro: "Ja existe uma conta com o email informado!" });
      }

      const image = await uploadImageCosmic(req);

      const usuarioASerSalvo = {
        nome: usuario.nome,
        email: usuario.email,
        senha: md5(usuario.senha),
        avatar: image?.media?.url,
      };
      await UsuarioModel.create(usuarioASerSalvo);
      return res.status(200).json({ msg: "Usuário criado com sucesso!" });
    }
  );

export const config = {
  api: {
    bodyParser: false,
  },
};
export default conectarMongoDB(handler);
