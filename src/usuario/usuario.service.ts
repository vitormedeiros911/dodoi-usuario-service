import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { Usuario } from './schema/usuario.schema';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly clientProxyService: ClientProxyService,
    @InjectModel('Usuario') private readonly usuarioModel: Model<Usuario>,
  ) {}

  private clientFarmaciaBackend =
    this.clientProxyService.getClientProxyFarmaciaServiceInstance();

  async criarUsuario(usuario: Usuario) {
    const usuarioExistente = await this.usuarioModel.findOne({
      cpf: usuario.cpf,
    });

    if (usuarioExistente)
      throw new RpcException(new BadRequestException('Usuário já cadastrado.'));

    if (usuario.idFarmacia) {
      const farmacia = await firstValueFrom(
        this.clientFarmaciaBackend.send(
          'buscar-farmacia-reduzida',
          usuario.idFarmacia,
        ),
      );

      if (!farmacia)
        throw new RpcException(
          new BadRequestException('Farmácia não encontrada.'),
        );
    }

    const novoUsuario = new this.usuarioModel({
      id: uuid(),
      ...usuario,
    });

    novoUsuario.save();
  }
}
