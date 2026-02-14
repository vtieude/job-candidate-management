// src/common/swagger/paginated.decorator.ts
import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dto/paginated.dto';

/**
 * Runtime class generator for Paginated<T>.
 * Produces a named class with lazy Swagger property types to avoid circular deps.
 */
export function createPaginatedDto<TModel extends Type<unknown>>(Model: TModel) {
  const name = Model.name || 'Item';

  @ApiExtraModels(Model)
  class PaginatedResponseDto implements PaginatedDto<TModel> {
    @ApiProperty()
    total: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    offset: number;

    @ApiProperty({
      // LAZY type reference is the key to avoid circular resolution:
      type: () => [Model],
    })
    results!: TModel[];
  }

  // Nice readable class name in Swagger UI
  Object.defineProperty(PaginatedResponseDto, 'name', {
    value: `Paginated${name}`,
  });

  return PaginatedResponseDto;
}

/**
 * Composable decorator for @ApiOkResponse with a paginated schema.
 * Ensures both the item model and the generated paginated class are registered.
 */
export function ApiPaginatedResponse<TModel extends Type<unknown>>(Model: TModel) {
  const Paginated = createPaginatedDto(Model);
  return applyDecorators(
    ApiExtraModels(Model),
    ApiExtraModels(Paginated),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(Paginated) }],
      },
    }),
  );
}
``