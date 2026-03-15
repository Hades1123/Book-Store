import { IsEnum } from 'class-validator';
import { type TFolderName } from 'src/modules/cloudinary/types/folder.types';

enum EFolder {
  avatar = 'avatar',
  product = 'product',
}

export class UploadFileDto {
  @IsEnum(EFolder)
  folder: TFolderName;
}
