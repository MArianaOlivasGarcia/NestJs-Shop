import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Product } from '../products/entities';
import { ArrayContains, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateCraftsmanDto } from './dto/create-craftsman.dto';
import { UpdateCraftsmanDto } from './dto/update-craftsman.dto';
import { Craftsman } from './entities/craftsman.entity';

@Injectable()
export class CraftsmanService {

  // El nombre de la clase en el cual voy a usar el logger (contexto)
  private readonly logger: Logger = new Logger('ProductsService');

  constructor(  
    @InjectRepository(Craftsman) private readonly craftsmanRepository: Repository<Craftsman>,  
    @InjectRepository(User) private readonly userRepository: Repository<User>,  
  ) {}


  async create(createCraftsmanDto: CreateCraftsmanDto, user: User) {
    try {
      
      // Crear la instancia del producto con sus propiedades
      const craftsma = this.craftsmanRepository.create({ 
        ...createCraftsmanDto,
        leader: user
      });

      // Grabar en base de datos
      await this.craftsmanRepository.save( craftsma );

      return craftsma;


    } catch ( error) {
      this.handleExceptions(error);
    }

  }

  async findAllLeaders( paginationDto: PaginationDto ) {


    const { limit = 20, page = 1 } = paginationDto;

    const leaders = await this.userRepository.find({
      // where: { roles: ArrayContains(['user']) },
      take: limit,
      skip: ( page - 1 ) * limit,
    });

    return leaders;
  }

  async findAll( paginationDto: PaginationDto ) {
    return await this.craftsmanRepository.find({})
  }

  findOne(id: number) {
    return `This action returns a #${id} craftsman`;
  }

  update(id: number, updateCraftsmanDto: UpdateCraftsmanDto) {
    return `This action updates a #${id} craftsman`;
  }

  remove(id: number) {
    return `This action removes a #${id} craftsman`;
  }


  private handleExceptions( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException(`${ error.detail }`)
    }

    this.logger.error(error)
    throw new InternalServerErrorException(`Unexpected error, check server logs.`)
  }

}
