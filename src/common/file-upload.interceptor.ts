import { FileInterceptor } from '@nestjs/platform-express';
import { NotAcceptableException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const mimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

export const FileUpload = (
  fieldName: string,
  allowedTypes: string[] = mimeTypes,
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
