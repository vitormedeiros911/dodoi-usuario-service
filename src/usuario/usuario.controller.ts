import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @MessagePattern('criar-usuario')
  async criarUsuario(@Payload() usuario: Usuario) {
    return this.usuarioService.criarUsuario(usuario);
  }

  @MessagePattern('buscar-usuario-para-autenticacao')
  async buscarUsuarioParaAutenticacao(
    @Payload() payload: { id: string; email: string },
  ) {
    return this.usuarioService.buscarUsuarioParaAutenticacao(payload);
  }
}