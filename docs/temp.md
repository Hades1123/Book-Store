1.  Tạo response interface:  


// src/common/interfaces/response.interface.ts  
 export interface ApiResponse<T> {
success: boolean;  
 data?: T;  
 message?: string;
}

export interface ApiError {
success: false;
error: {
code: string;
message: string;
};
}

2. Transform Interceptor (wrap success response):

// src/common/interceptors/transform.interceptor.ts
import {
Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
implements NestInterceptor<T, ApiResponse<T>>
{
intercept(
context: ExecutionContext,
next: CallHandler,
): Observable<ApiResponse<T>> {
return next.handle().pipe(
map((data) => ({
success: true,
data,
message: data?.message || undefined,
})),
);
}
}

3. Exception Filter (wrap error response):

// src/common/filters/http-exception.filter.ts
import {
ExceptionFilter,
Catch,
ArgumentsHost,
HttpException,
HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
catch(exception: unknown, host: ArgumentsHost) {
const ctx = host.switchToHttp();
const response = ctx.getResponse<Response>();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorCode = 'INTERNAL_ERROR';
      let message = 'Internal server error';

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === 'object') {
          const res = exceptionResponse as any;
          message = res.message || exception.message;
          errorCode = res.errorCode || this.getErrorCode(status);
        } else {
          message = exception.message;
          errorCode = this.getErrorCode(status);
        }
      }

      const errorResponse: ApiError = {
        success: false,
        error: {
          code: errorCode,
          message: Array.isArray(message) ? message[0] : message,
        },
      };

      response.status(status).json(errorResponse);
    }

    private getErrorCode(status: number): string {
      const map: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        500: 'INTERNAL_ERROR',
      };
      return map[status] || 'ERROR';
    }

}

4. Đăng ký trong main.ts:

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

    // Global interceptor & filter
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(3000);

}
bootstrap();

---

Kết quả:

// Controller - chỉ return data
@Post('register')
async register(@Body() dto: RegisterDto) {
return this.authService.register(dto);
// Tự động wrap thành: { success: true, data: {...} }
}

// Throw exception với custom code
throw new HttpException(
{ message: 'Email already exists', errorCode: 'EMAIL_EXISTS' },
HttpStatus.CONFLICT,
);
// Trả về: { success: false, error: { code: 'EMAIL_EXISTS', message: '...' } }

Bạn muốn mình tạo các file này không?
