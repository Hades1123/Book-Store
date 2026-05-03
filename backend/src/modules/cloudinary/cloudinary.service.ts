import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types/response.types';
import * as streamifier from 'streamifier';
import { TFolderName } from './types/folder.types';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File, folder: TFolderName): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
