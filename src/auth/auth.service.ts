import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AuthService {

  private readonly logger: Logger = new Logger('AuthService');

  constructor( @InjectRepository(User) private readonly userRepository: Repository<User>,
               private readonly jwtService: JwtService ){}

  async register(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
 
      const salt = bcrypt.genSaltSync();

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, salt )
      });

      await this.userRepository.save( user );

      // No retornar la contraseña
      delete user.password;

      return {
        status: true,
        user,
        accessToken: this.getJwtToken( {id: user.id} )
      };

    } catch (error) {
      this.handleExceptions(error)
    }


  }


  async login( loginUserDto: LoginUserDto ) {


    const { password, userName } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { userName },
      select: { userName: true, password: true, id: true }
    });


    if ( !user ) {
      throw new UnauthorizedException(`Credentials are not valid.`)
    }

    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException(`Credentials are not valid.`)
    }

    return {
      status: true,
      user,
      accessToken: this.getJwtToken( {id: user.id} )
    };
  }



  async renewToken( user: User ) {

    console.log(user)
    if ( !user ) throw new UnauthorizedException(`Unauthorized`)

    return {
      status: true,
      user,
      accessToken: this.getJwtToken( {id: user.id} )
    };

  }



  private getJwtToken( payload: JwtPayload ){
    const accessToken = this.jwtService.sign( payload );
    return accessToken;
  }





  private handleExceptions( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException({ status:false, message: error.detail })
    }

    this.logger.error(error)
    throw new InternalServerErrorException(`Unexpected error, check server logs.`)
  }


  async findAll( paginationDto: PaginationDto ) {

    const { limit = 20, page = 1 } = paginationDto;

    const [ results, totalResults ] = await Promise.all([
      this.userRepository.find({
        take: limit,
        skip: ( page - 1 ) * limit,
      }),
      this.userRepository.count()
    ])

    return { results, totalResults }

  }

}
