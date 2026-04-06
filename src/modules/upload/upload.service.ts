import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/modules/cloudinary/types/response.types';
import { TFolderName } from 'src/modules/cloudinary/types/folder.types';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File, folder: TFolderName): Promise<CloudinaryResponse> {
    return this.cloudinaryService.uploadFile(file, folder);
  }
}
