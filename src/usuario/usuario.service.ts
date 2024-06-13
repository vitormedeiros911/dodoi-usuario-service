import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Usuario } from './schema/usuario.schema';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<Usuario>,
  ) {}

  async criarUsuario(usuario: Usuario) {
    const usuarioExistente = await this.usuarioModel.findOne({
      cpf: usuario.cpf,
    });

    if (usuarioExistente)
      throw new RpcException(new BadRequestException('Usuário já cadastrado.'));

    const novoUsuario = new this.usuarioModel({
      id: uuid(),
      ...usuario,
    });

    novoUsuario.save();
  }
}
