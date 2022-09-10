import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID  } from 'uuid';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  // El nombre de la clase en el cual voy a usar el logger (contexto)
  private readonly logger: Logger = new Logger('ProductsService');

  constructor( 
    @InjectRepository(Product) private readonly productRepository: Repository<Product>, 
    @InjectRepository(ProductImage) private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) {}
  
  
  async create(createProductDto: CreateProductDto, user: User) {

    try {
      
      const { images = [], ...productDetails } = createProductDto;

      // Crear la instancia del producto con sus propiedades
      const product = this.productRepository.create({ 
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) ),
        user
      });

      // Grabar en base de datos
      await this.productRepository.save( product );

      // Que no lleguen las imagenes como objetos con ID, si no solo el arreglo de string
      return {...product, images};


    } catch ( error) {
      this.handleExceptions(error);
    }

  }



  async findAll( paginationDto: PaginationDto ) {

    const { limit = 20, offset = 0 } = paginationDto;

    const producs = await this.productRepository.find({
      take: limit,
      skip: offset,
      // Especificar que si haga la relación para traerme la data
      relations: {
        images: true,
        user: true
      }
    });

    // "Aplanar las imagenes, no mandar los ids solo los url de las imagenes como arreglo de string"

    // return producs.map( product => {
    //   return {
    //     ...product,
    //     images: product.images.map( image => image.url )
    //   }
    // });
    
    return producs.map( product => ({
        ...product,
        images: product.images.map( image => image.url )
    }));

  }



  async findOne( term: string) {

    let product: Product; 

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOne({ where: { id: term }, relations: {
        images: true,
        user: true
      } })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
      .where(`LOWER(title) =:title1 or slug =:slug1`, {
        title1: term.toLowerCase(),
        slug1: term.toLowerCase()
      })
      .leftJoinAndSelect('prod.images', 'prodImages') // Obtener sus relaciones
      .leftJoinAndSelect('prod.user', 'prodUser') // Obtener sus relaciones
      .getOne()

      // `select * from products where slug='termino' or title='termino';`
    }

    if ( !product ) {
      throw new NotFoundException(`Product with term "${term}" not found`)
    }

    return product;
  }


  async findOnePlain( term: string) {
    const { images = [], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }



  async update(id: string, updateProductDto: UpdateProductDto,  user: User) {

    const { images, ...rest } = updateProductDto;
    
    // Buscar el producto por ID y carga las propiedades definidas en updateProductDto
    const product = await this.productRepository.preload({
      id,
      ...rest,
    });

    if ( !product ) {
      throw new BadRequestException(`Product with ID "${id}" not found`);
    }


    // Crear nuestro Query Runner
    // Ejecuta varias instrucciones y si una falla puedo hacer el rollback
    const queryRunner = this.dataSource.createQueryRunner();

    // CREAR LA TRANSACCIÓN
    await queryRunner.connect();
    await queryRunner.startTransaction();


    
    try {

      if ( images ) {
        // Borrar las imagenes viejitas cuyo product.id sea el id
        await queryRunner.manager.delete( ProductImage, { product: { id } } )

        // Guardar las nuevas imagenes
        product.images = images.map( image => this.productImageRepository.create({ url: image }) )

      }
      
      product.user = user;
      await queryRunner.manager.save(product);

      // Sino hay errores hacer el commit de la transacción
      await queryRunner.commitTransaction();
      // release, el queryRunner ya no vuelve a funcionar
      await queryRunner.release();



      return this.findOnePlain( id );
  
    } catch (error) {

      // Si falla hacer el rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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


  async deleteAllProducts() {
    
    const query = this.productRepository.createQueryBuilder('product');

    try {
      
      await query.delete().where({}).execute();

    } catch (error) {
      this.handleExceptions(error);
    }


  }

}
