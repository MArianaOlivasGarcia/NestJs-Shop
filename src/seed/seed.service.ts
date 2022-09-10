import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor( private readonly producsService: ProductsService,
              @InjectRepository( User ) private readonly userRepository: Repository<User>) {
  }
 
  async runSeed(){

    await this.deleteTables();

    const user = await this.insertUsers();

    await this.insertProducts( user );
    
    return 'SEED EXECUTED'
  }


  private async deleteTables() {

    await this.producsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
    .delete()
    .where({})
    .execute();

  }



  private async insertProducts( user: User ) {
    // await this.producsService.deleteAllProducts();

    const products = initialData.products;

    const promises: Promise<any>[] = [];

    products.forEach( product => {
      promises.push( this.producsService.create( product, user ) );
    })


    await Promise.all( promises );

  }
  

  private async insertUsers() {

    // await this.producsService.deleteAllProducts();

    const usersSeed = initialData.users;

    const users: User[] = [];

    const salt = bcrypt.genSaltSync();

    usersSeed.forEach( user => {
      user.password = bcrypt.hashSync( user.password, salt )
      users.push( this.userRepository.create( user ) );
    })


    await this.userRepository.save( users )

    return users[0];

  }

}
