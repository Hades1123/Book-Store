import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  // App
  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsOptional()
  API_PREFIX?: string;

  // Database
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  DATABASE_HOST?: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  DATABASE_PORT?: number;

  @IsString()
  @IsOptional()
  DATABASE_USERNAME?: string;

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD?: string;

  @IsString()
  @IsOptional()
  DATABASE_NAME?: string;

  @IsString()
  @IsOptional()
  DATABASE_SYNCHRONIZE?: string;

  // External system
  @IsString()
  GMAIL_APP_PASS: string;

  @IsString()
  GMAIL_USER_NAME: string;

  // JWT strategy
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  // Cloudinary
  @IsString()
  CLOUDINARY_NAME: string;

  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsString()
  CLOUDINARY_API_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.map((e) => e.toString()).join(', ')}`);
  }

  return validatedConfig;
}
