import { FileInterceptor } from '@nestjs/platform-express';
import { NotAcceptableException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const fileUpload = (
  fieldName: string,
  allowedTypes: string[] = MIME_TYPES,
): ReturnType<typeof FileInterceptor> => {
  const multerOptions: MulterOptions = {
    fileFilter: (req, file, callback) => {
      if (!allowedTypes.includes(file.mimetype)) {
        callback(
          new NotAcceptableException(
            'Only WEBP, SVG, JPG, PNG, and PDF files are allowed',
          ),
          false,
        );
      } else {
        callback(null, true);
      }
    },
  };
  
return FileInterceptor(fieldName, multerOptions);
};
