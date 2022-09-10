

export const FileFilter = ( req: Express.Request, file: Express.Multer.File, cb: Function ) => {

    // console.log({file})
    if ( !file ) return cb( new Error('File is empty'), false );

    const fileExtension = file.mimetype.split('/')[1];
    const extensionsValid = ['png', 'gif', 'jpeg', 'jpg', 'webp'];

    if ( extensionsValid.includes( fileExtension ) ) {
        // no sucedio un error, y si acepto el archivo
        return cb( null, true );
    }
    
   
    cb( null, false );
    

}