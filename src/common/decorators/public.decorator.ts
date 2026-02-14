// public.decorator.ts
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true), // For your JwtAuthGuard
    ApiBearerAuth(undefined),              // For Swagger (removes the lock icon)
  );
};
