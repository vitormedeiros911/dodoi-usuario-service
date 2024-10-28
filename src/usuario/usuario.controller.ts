import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @MessagePattern('criar-usuario')
  async criarUsuario(@Payload() usuario: Usuario) {
    return this.usuarioService.criarUsuario(usuario);
  }

  @MessagePattern('buscar-usuario')
  async buscarUsuario(@Payload() payload: { id?: string; email?: string }) {
    return this.usuarioService.buscarUsuario(payload);
  }

  @MessagePattern('buscar-perfil-usuario')
  async buscarPerfilUsuario(@Payload() idUsuario: string) {
    return this.usuarioService.buscarPerfilUsuario(idUsuario);
  }

  @MessagePattern('atualizar-usuario')
  async atualizarUsuario(@Payload() usuario: Usuario) {
    await this.usuarioService.atualizarUsuario(usuario);
  }

  @MessagePattern('inativar-usuario')
  async inativarUsuario(@Payload() usuario: Usuario) {
    await this.usuarioService.inativarUsuario(usuario);
  }

  @EventPattern('associar-usuario-admin-farmacia')
  async associarUsuarioAdminFarmacia(
    @Payload() payload: { idUsuario: string; idFarmacia: string },
  ) {
    return this.usuarioService.associarUsuarioAdminFarmacia(payload);
  }

  @MessagePattern('buscar-endereco-por-id-usuario')
  async buscarEnderecoPorIdUsuario(@Payload() idUsuario: string) {
    return this.usuarioService.buscarEnderecoPorIdUsuario(idUsuario);
  }
}
