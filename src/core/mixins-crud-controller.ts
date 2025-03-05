import { MixinsCrudEntity } from './mixins-crud-entity';
import { MixinsCrudService } from './mixins-crud-service';
import {
  BadRequestException,
  Body,
  Delete,
  Get,
  HttpCode,
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

export abstract class MixinsCrudController<
  ENTITY extends MixinsCrudEntity,
  SERVICE extends MixinsCrudService<ENTITY>,
> {
  protected constructor(
    private readonly service: SERVICE,
    private readonly entity: ENTITY,
  ) {}

  getCreateDto(): Type<any> {
    return Reflect.getMetadata(CREATE_DTO_KEY, this.constructor) || Object;
  }

  getUpdateDto(): Type<any> {
    return Reflect.getMetadata(UPDATE_DTO_KEY, this.constructor) || Object;
  }

  getResponseDto(): Type<any> {
    return Reflect.getMetadata(RESPONSE_DTO_KEY, this.constructor) || Object;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: InstanceType<ReturnType<this['getCreateDto']>>): Promise<any> {
    try {
      const entity = await this.service.createEntity(createDto);
      return this.transformToResponseDto(entity);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<any[]> {
    try {
      const entities = await this.service.findAllEntities();
      return entities.map((entity) => this.transformToResponseDto(entity));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: number): Promise<any | undefined> {
    try {
      const entity = await this.service.findEntity(id);
      return this.transformToResponseDto(entity);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this.service.deleteEntity(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateDto: InstanceType<ReturnType<this['getUpdateDto']>>,
  ): Promise<any> {
    try {
      const entity = await this.service.updateEntity(id, updateDto);
      return this.transformToResponseDto(entity);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id') id: number,
    @Body() updateDto: InstanceType<ReturnType<this['getUpdateDto']>>,
  ): Promise<any> {
    try {
      const entity = await this.service.updateEntity(id, updateDto);
      return this.transformToResponseDto(entity);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private transformToResponseDto<ENTITY>(
    entity: ENTITY,
  ): InstanceType<ReturnType<this['getResponseDto']>> {
    const responseMetadata = Reflect.getMetadata(RESPONSE_DTO_KEY, this.constructor);
    const { dto, transformFn } = responseMetadata;
    const transformed = EntityToDtoMapper.map(dto, entity);

    return transformFn
      ? transformFn(transformed)
      : (transformed as InstanceType<ReturnType<this['getResponseDto']>>);
  }

  private async setValidationPipes<DTO>(dto: DTO, dtoClass: new () => DTO): Promise<DTO> {
    try {
      const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          throw new BadRequestException(errors);
        },
      });
      return await validationPipe.transform(dto, {
        type: 'body',
        metatype: dtoClass,
      });
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
