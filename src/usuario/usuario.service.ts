import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { removeMask } from '../shared/functions/remove-mask';
import { PerfilEnum } from './enum/perfil.enum';
import { StatusEnum } from './enum/status.enum';
import { Usuario } from './schema/usuario.schema';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<Usuario>,
  ) {}

  async criarUsuario(usuario: Usuario) {
    usuario.cpf = removeMask(usuario.cpf);

    const usuarioExistente = await this.usuarioModel
      .findOne({
        cpf: usuario.cpf,
      })
      .select(['id'])
      .exec();

    if (usuarioExistente)
      throw new RpcException(new BadRequestException('Usuário já cadastrado.'));

    usuario.endereco.cep = removeMask(usuario.endereco.cep);

    const novoUsuario = new this.usuarioModel({
      id: uuid(),
      ...usuario,
      perfis: [PerfilEnum.CLIENTE],
    });

    await novoUsuario.save();

    return {
      mensagem: 'Usuário criado com sucesso',
    };
  }

  async buscarUsuario(payload: {
    id?: string;
    email?: string;
    status?: StatusEnum;
  }) {
    const { id, email, status } = payload;

    const query = this.usuarioModel
      .findOne()
      .select(['id', 'nome', 'email', 'idFarmacia', 'perfis']);

    if (id) query.where('id').equals(id);

    if (email) query.where('email').equals(email);

    if (status) query.where('status').equals(status);
    else query.where('status').equals(StatusEnum.ATIVO);

    return query.exec();
  }

  async atualizarUsuario(usuario: Usuario) {
    await this.usuarioModel.updateOne({ id: usuario.id }, usuario);
  }

  async associarUsuarioAdminFarmacia(payload: {
    idUsuario: string;
    idFarmacia: string;
  }) {
    const { perfis } = await this.usuarioModel
      .findOne({ id: payload.idUsuario })
      .select(['perfis'])
      .exec();

    perfis.push(PerfilEnum.ADMIN_FARMACIA);

    await this.usuarioModel.updateOne(
      { id: payload.idUsuario },
      {
        idFarmacia: payload.idFarmacia,
        perfis,
      },
    );
  }

  async buscarEnderecoPorIdUsuario(idUsuario: string) {
    return this.usuarioModel
      .findOne({ id: idUsuario })
      .select(['id', 'endereco'])
      .where('status')
      .equals(StatusEnum.ATIVO)
      .exec();
  }
}
