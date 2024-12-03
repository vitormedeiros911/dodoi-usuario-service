import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { StatusEnum } from './enum/status.enum';
import { Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';

const ackErrors: string[] = ['E11000'];

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @MessagePattern('criar-usuario')
  async criarUsuario(@Payload() usuario: Usuario, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.usuarioService.criarUsuario(usuario);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-usuario')
  async buscarUsuario(
    @Payload() payload: { id?: string; email?: string; status?: StatusEnum },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.usuarioService.buscarUsuario(payload);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-perfil-usuario')
  async buscarPerfilUsuario(
    @Payload() idUsuario: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.usuarioService.buscarPerfilUsuario(idUsuario);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-usuario')
  async atualizarUsuario(
    @Payload() usuario: Usuario,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.usuarioService.atualizarUsuario(usuario);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }

  @EventPattern('inativar-usuario')
  async inativarUsuario(
    @Payload() idUsuario: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.usuarioService.inativarUsuario(idUsuario);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }

  @EventPattern('ativar-usuario')
  async ativarUsuario(@Payload() email: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.usuarioService.ativarUsuario(email);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }

  @EventPattern('associar-usuario-admin-farmacia')
  async associarUsuarioAdminFarmacia(
    @Payload() payload: { idUsuario: string; idFarmacia: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.usuarioService.associarUsuarioAdminFarmacia(payload);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-contato-usuario')
  async buscarContato(
    @Payload() idUsuario: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.usuarioService.buscarContato(idUsuario);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
