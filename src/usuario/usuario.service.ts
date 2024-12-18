import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { removeMask } from '../shared/functions/remove-mask';
import { PerfilEnum } from './enum/perfil.enum';
import { StatusEnum } from './enum/status.enum';
import { Usuario } from './schema/usuario.schema';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<Usuario>,
    private readonly clientProxyService: ClientProxyService,
  ) {}

  private clientFarmaciaBackend =
    this.clientProxyService.getClientProxyFarmaciaServiceInstance();

  async criarUsuario(usuario: Usuario) {
    const id = uuid();

    const novoUsuario = new this.usuarioModel({
      id,
      ...usuario,
      perfis: [PerfilEnum.CLIENTE],
    });

    await novoUsuario.save();

    return this.buscarUsuario({ id });
  }

  async buscarUsuario(payload: {
    id?: string;
    email?: string;
    status?: StatusEnum;
  }) {
    const { id, email, status } = payload;

    const query = this.usuarioModel
      .findOne()
      .select([
        'id',
        'nome',
        'email',
        'idFarmacia',
        'perfis',
        'urlImagem',
        'status',
      ]);

    if (id) query.where('id').equals(id);

    if (email) query.where('email').equals(email);

    if (status) query.where('status').equals(status);
    else query.where('status').equals(StatusEnum.ATIVO);

    return query.exec();
  }

  async atualizarUsuario(usuario: Usuario) {
    if (usuario.cpf) usuario.cpf = removeMask(usuario.cpf);
    if (usuario.telefone) usuario.telefone = removeMask(usuario.telefone);
    if (usuario.endereco?.cep)
      usuario.endereco.cep = removeMask(usuario.endereco.cep);

    await this.usuarioModel.updateOne({ id: usuario.id }, usuario);
  }

  async inativarUsuario(idUsuario: string) {
    const usuario = await this.buscarUsuario({ id: idUsuario });

    if (usuario.idFarmacia)
      this.clientFarmaciaBackend.emit('inativar-farmacia', usuario.idFarmacia);

    await this.usuarioModel.updateOne(
      { id: idUsuario },
      { status: StatusEnum.INATIVO },
    );
  }

  async ativarUsuario(email: string) {
    const usuario = await this.buscarUsuario({
      email,
      status: StatusEnum.INATIVO,
    });

    if (usuario.idFarmacia)
      this.clientFarmaciaBackend.emit('ativar-farmacia', usuario.idFarmacia);

    await this.usuarioModel.updateOne({ email }, { status: StatusEnum.ATIVO });
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

  async buscarContato(idUsuario: string) {
    return this.usuarioModel
      .findOne({ id: idUsuario })
      .select(['endereco', 'id', 'nome', 'telefone', 'email'])
      .where('status')
      .equals(StatusEnum.ATIVO)
      .exec();
  }

  async buscarPerfilUsuario(id: string) {
    return this.usuarioModel.findOne({ id }).exec();
  }
}
