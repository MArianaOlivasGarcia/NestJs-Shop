import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Module({
  providers: [
    MessagesWsGateway, 
    MessagesWsService
  ],
  imports: [
    AuthModule,

    TypeOrmModule.forFeature([
      Message
    ]),

  ]
})
export class MessagesWsModule {}
