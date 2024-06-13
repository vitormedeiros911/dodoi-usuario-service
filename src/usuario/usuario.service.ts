import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Usuario } from './schema/usuario.schema';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<Usuario>,
  ) {}

  async criarUsuario(usuario: Usuario): Promise<void> {
    const novoUsuario = new this.usuarioModel({
      id: uuid(),
      ...usuario,
    });

    novoUsuario.save();
  }
}
