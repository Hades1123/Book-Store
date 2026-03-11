import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ApiError>>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_ERROR';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const result = exceptionResponse as any;
      errorCode = result.errorCode;
      message = result.message;
    }

    response.status(status).json({
      error: {
        code: errorCode,
        message: message,
      },
      success: false,
    });
  }
}
