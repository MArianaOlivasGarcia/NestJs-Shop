import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { FileFilter, FileNamer } from './helpers';

@Controller('files')
export class FilesController {


  constructor( private readonly filesService: FilesService,
               private readonly configService: ConfigService ) {}



  @Get('product/:imageName')
  findImga( 
    @Res() res : Response,
    @Param('imageName') imageName: string 
  ) {

    const path = this.filesService.getStaticImage( imageName );

    res.sendFile( path );
    
  }



  @Post('product') 
  // Usar un interceptor
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: FileFilter,
    storage: diskStorage({
      destination: `./static/products`,
      filename: FileNamer
    })
  })) // El nombre de como lo voy a mandar desde el front
  uploadFile( @UploadedFile() file: Express.Multer.File ) {
 
    console.log(file)

    if ( !file ) throw new BadRequestException('Make sure that the file is an image');

    return {
      fileName: file.filename,
      secureUrl: `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`
    };
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter: FileFilter,
    storage: diskStorage({
      destination: `./static/products`,
      filename: FileNamer
    })
  }))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {

    console.log(files)
    if ( files.length === 0 ) throw new BadRequestException('Make sure that the files are images');

    return files.map( file => ({
      fileName: file.filename, 
      secureUrl: `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`
    }));

  } 

  
}
