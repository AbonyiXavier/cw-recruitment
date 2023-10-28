import { BadRequestException } from '@nestjs/common';
import { MAX_PHOTOS, VALID_FILE_TYPES } from './constant';

export const validatePhotoUploads = (photos: Express.Multer.File[]) => {
  const invalidFiles = photos.filter(
    (file) => !VALID_FILE_TYPES.includes(file.mimetype),
  );

  if (invalidFiles.length > 0) {
    throw new BadRequestException(
      `Invalid file types. Only JPEG and PNG are allowed.`,
    );
  }

  if (photos.length > MAX_PHOTOS) {
    throw new BadRequestException(`You can upload up to ${MAX_PHOTOS} photos.`);
  }
};
