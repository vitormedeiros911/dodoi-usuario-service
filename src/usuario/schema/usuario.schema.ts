import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PerfilEnum } from '../enum/perfil.enum';
import { StatusEnum } from '../enum/status.enum';
import { IEndereco } from '../interface/endereco.interface';

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  cpf: string;

  @Prop({ required: true, default: StatusEnum.ATIVO })
  status: string;

  @Prop({ required: true })
  urlImagem: string;

  @Prop({ required: false })
  dataNascimento: Date;

  @Prop({ required: false })
  telefone: string;

  @Prop({
    type: {
      logradouro: { type: String, required: false },
      numero: { type: String, required: false },
      complemento: { type: String, required: false },
      bairro: { type: String, required: false },
      cidade: { type: String, required: false },
      uf: { type: String, required: false },
      cep: { type: String, required: false },
    },
    required: false,
  })
  endereco: IEndereco;

  @Prop({ required: true, enum: PerfilEnum, type: [String] })
  perfis: PerfilEnum[];

  @Prop({ required: false })
  idFarmacia?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
