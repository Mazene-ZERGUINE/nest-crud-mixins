import { MixinsCrudEntity } from './mixins-crud-entity';
import { MixinsCrudService } from './mixins-crud-service';
import {
  BadRequestException,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { CREATE_DTO_KEY } from '../decorators/create-dto.decorator';
import { UPDATE_DTO_KEY } from '../decorators/update-dto.decorator';
import { RESPONSE_DTO_KEY } from '../decorators/response-dto.decorator';
import { EntityToDtoMapper } from '../utils/entity-to-dto.mapper';
import { DeepPartial } from 'typeorm';
import { FilterOptions } from './interfaces/filter-options';
import { IMixinsCrudControllerInterface } from './interfaces/mixins-curd-controller-interface';
import { DTOException } from '../exceptions/dto.exception';
import { LoggerUtils } from '../utils/logger.utils';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { DTOValidationException } from '../exceptions/dto-validation.exception';

/**
 * Abstract controller class providing CRUD operations for a NestJS application.
 * This class defines common endpoints and delegates actual data operations to a service.
 * It also includes validation, logging, and exception handling.
 *
 * @template ENTITY The entity type that extends `MixinsCrudEntity`
 * @template SERVICE The service type that extends `MixinsCrudService`
 */
export abstract class MixinsCrudController<
  ENTITY extends MixinsCrudEntity,
  SERVICE extends MixinsCrudService<ENTITY>,
> implements IMixinsCrudControllerInterface<ENTITY>
{
  /**
   * Constructs a new instance of `MixinsCrudController`
   *
   * @param service - The CRUD service responsible for handling business logic and data access.
   * @param entity - The entity type that this controller manages.
   */
  protected constructor(
    private readonly service: SERVICE,
    private readonly entity: ENTITY,
  ) {}

  /**
   * Stores filtering options to be applied when retrieving entities.
   */
  filterOptions?: FilterOptions = {};

  /**
   * Retrieves the DTO class used for entity creation.
   *
   * @param methodName - (Optional) The method name for retrieving method-specific metadata.
   * @returns The DTO class or `Object` if not specified.
   */
  getCreateDto(methodName?: string): Type<any> {
    if (methodName) {
      const methodDto = Reflect.getMetadata(CREATE_DTO_KEY, this, methodName);
      if (methodDto) return methodDto;
    }
    return Reflect.getMetadata(CREATE_DTO_KEY, this.constructor) || Object;
  }

  /**
   * Retrieves the DTO class used for entity updates.
   *
   * @param methodName - (Optional) The method name for retrieving method-specific metadata.
   * @returns The DTO class or `Object` if not specified.
   */
  getUpdateDto(methodName?: string): Type<any> {
    if (methodName) {
      const methodDto = Reflect.getMetadata(UPDATE_DTO_KEY, this, methodName);
      if (methodDto) return methodDto;
    }
    return Reflect.getMetadata(UPDATE_DTO_KEY, this.constructor) || Object;
  }

  /**
   * Creates a new entity.
   *
   * @param createDto - The DTO containing entity creation data.
   * @returns The created entity transformed into a response DTO.
   * @throws DTOException if the `@CreateDto()` decorator is missing.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: InstanceType<ReturnType<this['getCreateDto']>>,
  ): Promise<DeepPartial<ENTITY>> {
    const dto = this.getCreateDto('create');
    if (!dto) {
      LoggerUtils.logError('No CreateDto found. Use @CreateDto() decorator.');
      throw new DTOException('No CreateDto found. Use @CreateDto() decorator.');
    }
    try {
      await this.setValidationPipes(createDto, dto);
      const entity = await this.service.createEntity(createDto);
      return this.transformToResponseDto(entity, 'create');
    } catch (error) {
      LoggerUtils.logError('Error in create()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  /**
   * Retrieves all entities, applying configured filters.
   *
   * @returns A list of entities transformed into response DTOs.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<DeepPartial<ENTITY>[]> {
    try {
      const entities: ENTITY[] = await this.service.findAllEntities(this.filterOptions);
      return this.transformToResponseDto(entities, 'getAll');
    } catch (error) {
      LoggerUtils.logError('Error in getAll()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  /**
   * Retrieves a single entity by its ID.
   *
   * @param id - The entity ID.
   * @returns The requested entity transformed into a response DTO.
   * @throws EntityNotFoundException if the entity does not exist.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: number): Promise<DeepPartial<ENTITY> | undefined> {
    const entity = await this.service.findEntity(id);
    if (!entity) {
      LoggerUtils.logError(`Entity ${this.entity.getEntityName()} with id ${id} not found`);
      throw new EntityNotFoundException(
        `Entity ${this.entity.getEntityName()} with id ${id} not found`,
      );
    }
    try {
      return this.transformToResponseDto(entity, 'getOne');
    } catch (error) {
      LoggerUtils.logError('Error in getOne()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  /**
   * Deletes an entity by its ID.
   *
   * @param id - The entity ID.
   * @throws EntityNotFoundException if the entity does not exist.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      const entity = await this.service.findEntity(id);
      if (!entity) {
        throw new EntityNotFoundException(
          `Entity ${this.entity.getEntityName()} with id ${id} not found`,
        );
      }

      if (this.filterOptions?.includeDeleted) {
        await this.service.softDeleteEntity(id);
      } else {
        await this.service.deleteEntity(id);
      }
    } catch (error) {
      LoggerUtils.logError('Error in delete()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  /**
   * Updates an existing entity.
   *
   * @param id - The entity ID.
   * @param updateDto - The DTO containing the updated entity data.
   * @returns The updated entity transformed into a response DTO.
   * @throws DTOException if the `@UpdateDto()` decorator is missing.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateDto: InstanceType<ReturnType<this['getUpdateDto']>>,
  ): Promise<DeepPartial<ENTITY>> {
    const dto = this.getCreateDto('update');
    if (!dto) {
      LoggerUtils.logError('No UpdateDto found. Use @UpdateDto() decorator.');
      throw new DTOException('No UpdateDto found. Use @UpdateDto() decorator.');
    }
    await this.setValidationPipes(updateDto, dto);
    try {
      const entity = await this.service.updateEntity(id, updateDto);
      return this.transformToResponseDto(entity, 'update');
    } catch (error) {
      LoggerUtils.logError('Error in update()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id') id: number,
    @Body() updateDto: InstanceType<ReturnType<this['getUpdateDto']>>,
  ): Promise<DeepPartial<ENTITY>> {
    const dto = this.getCreateDto('update');
    if (!dto) {
      LoggerUtils.logError("No UpdateDto found 'usage of @UpdateDto() decorator is mandatory'");
      throw new DTOException("No UpdateDto found 'usage of @UpdateDto() decorator is mandatory'");
    }
    try {
      await this.setValidationPipes(updateDto, dto);
      const entity = await this.service.updateEntity(id, updateDto);
      return this.transformToResponseDto(entity, 'partialUpdate');
    } catch (error) {
      LoggerUtils.logError('Error in create()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  /**
   * Restores a soft-deleted entity.
   *
   * @param id - The entity ID.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  @Patch(':id/restore')
  async restoreEntity(@Param('id') id: number): Promise<void> {
    try {
      await this.service.restoreEntity(id);
    } catch (error) {
      LoggerUtils.logError('Error in restoreEntity()', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  private transformToResponseDto<ENTITY>(entity: ENTITY | ENTITY[], methodName?: string): any {
    const methodResponseMeta = methodName
      ? Reflect.getMetadata(RESPONSE_DTO_KEY, this, methodName)
      : null;

    const classResponseMeta = Reflect.getMetadata(RESPONSE_DTO_KEY, this.constructor);
    if (!classResponseMeta && !methodResponseMeta) {
      LoggerUtils.logWarning('No @ResponseDto() decorator found entity object will be returned');
      return entity;
    }

    const { dto, transformFn } = methodResponseMeta || classResponseMeta || {};

    const transformedData = Array.isArray(entity)
      ? entity.map((item) => EntityToDtoMapper.map(dto || Object, item))
      : EntityToDtoMapper.map(dto || Object, entity);

    return transformFn && !Array.isArray(entity)
      ? transformFn(transformedData)
      : transformFn
        ? transformFn(transformedData)
        : transformedData;
  }

  private async setValidationPipes<DTO>(dto: DTO, dtoClass: new () => DTO): Promise<DTO> {
    const validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        throw new DTOValidationException(errors);
      },
    });
    return await validationPipe.transform(dto, {
      type: 'body',
      metatype: dtoClass,
    });
  }
}
