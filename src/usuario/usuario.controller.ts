import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';
import { StatusEnum } from './enum/status.enum';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @MessagePattern('criar-usuario')
  async criarUsuario(@Payload() usuario: Usuario) {
    return this.usuarioService.criarUsuario(usuario);
  }

  @MessagePattern('buscar-usuario')
  async buscarUsuario(
    @Payload() payload: { id?: string; email?: string; status?: StatusEnum },
  ) {
    return this.usuarioService.buscarUsuario(payload);
  }

  @MessagePattern('buscar-perfil-usuario')
  async buscarPerfilUsuario(@Payload() idUsuario: string) {
    return this.usuarioService.buscarPerfilUsuario(idUsuario);
  }

  @EventPattern('atualizar-usuario')
  async atualizarUsuario(@Payload() usuario: Usuario) {
    await this.usuarioService.atualizarUsuario(usuario);
  }

  @EventPattern('inativar-usuario')
  async inativarUsuario(@Payload() idUsuario: string) {
    await this.usuarioService.inativarUsuario(idUsuario);
  }

  @EventPattern('ativar-usuario')
  async ativarUsuario(@Payload() email: string) {
    await this.usuarioService.ativarUsuario(email);
  }

  @EventPattern('associar-usuario-admin-farmacia')
  async associarUsuarioAdminFarmacia(
    @Payload() payload: { idUsuario: string; idFarmacia: string },
  ) {
    return this.usuarioService.associarUsuarioAdminFarmacia(payload);
  }

  @MessagePattern('buscar-contato-usuario')
  async buscarContato(@Payload() idUsuario: string) {
    return this.usuarioService.buscarContato(idUsuario);
  }
}
