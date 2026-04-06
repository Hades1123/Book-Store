import { MaxFileSizeValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export class maxFileSizeValidator extends MaxFileSizeValidator {
  override buildErrorMessage(file?: IFile): string {
    return 'Only image/png image/jpeg and imge/jpg';
  }
}
