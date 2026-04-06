import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/common/interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ApiResponse>>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string | undefined;
    let message = 'Internal server error';

    /**
    AppException format:
    {
      "errorCode": "AUTH_EMAIL_EXISTS",
      "message": "Email already registered"
    }

    Class-validator error format:                                                                                                          
    {                                                                                                                                                                          
      "statusCode": 400,
      "message": [                                                                                                                                                             
        "email must be an email",
        "password must be longer than 8 characters"
      ],
      "error": "Bad Request"
    }
     */
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const result = exceptionResponse as Record<string, any>;
      status = exception.getStatus();
      // it means we encounter custom exception
      if (result.errorCode) {
        errorCode = result.errorCode;
      }

      if (Array.isArray(result.message)) {
        message = result.message.join(', ');
      } else {
        message = result.message;
      }
    }

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        message: message,
      },
    };
    if (errorCode) {
      errorResponse.error!.code = errorCode;
    }

    response.status(status).json(errorResponse);
  }
}
