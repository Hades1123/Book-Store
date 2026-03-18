import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { RESPONSE_MESSAGE_KEY } from 'src/common/decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflactor: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const message = this.reflactor.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return next.handle().pipe(
      map((data) => ({
        success: true,
        ...(message ? { message } : { message: 'Success !!!' }),
        data: data,
      })),
    );
  }
}
