import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  constructor(private configService: ConfigService) {}

  private url = `amqp://${this.configService.get<string>('RMQ_USER')}:${this.configService.get<string>('RMQ_PASSWORD')}@${this.configService.get<string>('RMQ_HOST')}`;

  getClientProxyFarmaciaServiceInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: 'farmacias',
      },
    });
  }
}
