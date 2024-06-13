import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientProxyModule } from '../client-proxy/client-proxy.module';
import { UsuarioSchema } from './schema/usuario.schema';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [
    ClientProxyModule,
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }]),
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
