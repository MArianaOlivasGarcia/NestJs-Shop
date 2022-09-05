import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true 
        // solo en desarrollo, en producción no
        // (sincroniza automaricamente las columnas al cambiar la definicion de los esquemas)
    }),

    ProductsModule,

    CommonModule
  ],
  controllers: [

  ],
  providers: [
    
  ],
})
export class AppModule {}
