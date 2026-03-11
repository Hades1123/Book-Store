import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
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

  @IsString()
  GMAIL_APP_PASS?: string;

  @IsString()
  GMAIL_USER_NAME?: string;
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
