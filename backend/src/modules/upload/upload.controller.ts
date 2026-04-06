import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryResponse } from 'src/modules/cloudinary/types/response.types';
import { UploadService } from './upload.service';
import { IMAGE_TYPE_REGEX, MAX_FILE_SIZE } from 'src/common/constants/common';
import { maxFileSizeValidator } from 'src/common/pipes/maxFileSizeValidator.pipe';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new maxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: IMAGE_TYPE_REGEX }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ): Promise<CloudinaryResponse> {
    const { folder } = body;
    return this.uploadService.uploadFile(file, folder);
  }
}
