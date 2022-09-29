import { Module } from '@nestjs/common';
import { CraftsmanService } from './craftsman.service';
import { CraftsmanController } from './craftsman.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Craftsman } from './entities/craftsman.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CraftsmanController],
  providers: [CraftsmanService],
  imports: [
    TypeOrmModule.forFeature([
      Craftsman
    ]),

    AuthModule
  ]
})
export class CraftsmanModule {}
