import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthService } from './auth.service';
import { Auth, GetUser, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }


  @Post('login')
  login(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }


  @Get('renew')
  // Ruta privada
  @UseGuards( AuthGuard() )
  renew(
    // @Req() request: Express.Request 
    @GetUser() user: User,
    // @GetUser('email') userEmail: string
    ) {
    return this.authService.renewToken( user );
  }





  @Get('private')
  // Añadir algo a la metadata
  // @SetMetadata('roles', ['admin', 'super-admin'])
  // Cramos un decorador para añadir datos a la metadata
  @RoleProtected( ValidRoles.admin )
  // Ruta privada, nuestros guards personalizados no lleva ()
  @UseGuards( AuthGuard(), UserRoleGuard )
  private( @GetUser() user: User ) {
    console.log(user)
  }



  @Get('private2')
  // @Auth( ValidRoles.sudo, ValidRoles.admin )
  @Auth( ValidRoles.admin )
  // @Auth( ) Sin protección
  private2( @GetUser() user: User ) {
    console.log(user)
  }




  @Get('users')
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.authService.findAll( paginationDto );
  }




}
