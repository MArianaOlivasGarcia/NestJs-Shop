import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID  } from 'uuid';

@Injectable()
export class ProductsService {

  // El nombre de la clase en el cual voy a usar el logger (contexto)
  private readonly logger: Logger = new Logger('ProductsService');

  constructor( @InjectRepository(Product) private readonly productRepository: Repository<Product> ) {}
  
  
  async create(createProductDto: CreateProductDto) {

    try {
      
      // Crear la instancia del producto con sus propiedades
      const product = this.productRepository.create( createProductDto );

      // Grabar en base de datos
      await this.productRepository.save( product );

      return product;


    } catch ( error) {
      this.handleExceptions(error);
    }

  }



  async findAll( paginationDto: PaginationDto ) {

    const { limit = 20, offset = 0 } = paginationDto;

    const producs = await this.productRepository.find({
      take: limit,
      skip: offset
    });

    return producs;
  }



  async findOne( term: string) {

    let product: Product; 

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where(`LOWER(title) =:title1 or slug =:slug1`, {
        title1: term.toLowerCase(),
        slug1: term.toLowerCase()
      }).getOne()

      // `select * from products where slug='termino' or title='termino';`
    }


    if ( !product ) {
      throw new NotFoundException(`Product with term "${term}" not found`)
    }

    return product;
  }



  async update(id: string, updateProductDto: UpdateProductDto) {
    
    // Buscar el producto por ID y carga las propiedades definidas en updateProductDto
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });

    if ( !product ) {
      throw new BadRequestException(`Product with ID "${id}" not found`);
    }

    // en el return no es necesario poner el await 
    // por defecto espera a que la promesa se termine
    try {
      return this.productRepository.save( product );
    } catch (error) {
      this.handleExceptions(error);
    }

  }



  async remove(id: string) {

    const product = await this.findOne(id);

    await this.productRepository.remove(product);

  }


  private handleExceptions( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException(`${ error.detail }`)
    }

    this.logger.error(error)
    throw new InternalServerErrorException(`Unexpected error, check server logs.`)
  }

}
