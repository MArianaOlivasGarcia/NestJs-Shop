import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ValidRoles } from '../auth/interfaces';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { CraftsmanService } from './craftsman.service';
import { CreateCraftsmanDto } from './dto/create-craftsman.dto';
import { UpdateCraftsmanDto } from './dto/update-craftsman.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('craftsman')
export class CraftsmanController {
  constructor(private readonly craftsmanService: CraftsmanService) {}

  @Post()
  @Auth( ValidRoles.user )
  create(@Body() createCraftsmanDto: CreateCraftsmanDto, @GetUser() user: User ) {
    return this.craftsmanService.create(createCraftsmanDto, user);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.craftsmanService.findAll( paginationDto );
  }


  @Get('leaders')
  findAllLeaders( @Query()  paginationDto: PaginationDto ) {
    return this.craftsmanService.findAllLeaders( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.craftsmanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCraftsmanDto: UpdateCraftsmanDto) {
    return this.craftsmanService.update(+id, updateCraftsmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.craftsmanService.remove(+id);
  }
}
