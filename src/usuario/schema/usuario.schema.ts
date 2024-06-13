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

  @Prop({ required: true })
  cpf: string;

  @Prop({ required: true, default: StatusEnum.ATIVO })
  status: string;

  @Prop({ required: true })
  urlImagem: string;

  @Prop({ required: true })
  dataNascimento: Date;

  @Prop({ required: true })
  telefone: string;

  @Prop({
    type: {
      logradouro: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: { type: String, required: false },
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      uf: { type: String, required: true },
      cep: { type: String, required: true },
    },
    required: true,
  })
  endereco: IEndereco;

  @Prop({ required: true, enum: PerfilEnum, type: [String] })
  perfis: PerfilEnum[];

  @Prop({ required: false })
  idFarmacia?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
