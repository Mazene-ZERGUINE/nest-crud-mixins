import { ICrudControllerInterface } from './mixins-curd-controller-interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { IMixinsCrudService } from './mixins-crud-service-interface';
import { IMixinsCrudEntity } from './mixins-crud-entity-interface';

@Controller()
export abstract class MixinCrudController<
  DTO,
  RESPONSE_DTO,
  ENTITY extends IMixinsCrudEntity<RESPONSE_DTO>,
> implements ICrudControllerInterface<DTO, RESPONSE_DTO>
{
  protected constructor(protected readonly _service: IMixinsCrudService<DTO, ENTITY>) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: DTO): Promise<RESPONSE_DTO | void> {
    try {
      return await this._service.createEntity(createDto).then((entity) => entity?.toModel());
    } catch (error) {
      // TODO: replace with custom exception later
      // TODO: add Logging methode
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<RESPONSE_DTO[]> {
    try {
      return await this._service
        .findAllEntities()
        .then((entities) => entities.map((entity) => entity.toModel()));
    } catch (error) {
      // TODO: replace with custom exception later
      // TODO: add Logging methode
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: number): Promise<RESPONSE_DTO | undefined> {
    try {
      return await this._service.findEntity(id).then((entity) => entity?.toModel());
    } catch (error) {
      // TODO: replace with custom exception later
      // TODO: add Logging methode
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this._service.deleteEntity(id);
    } catch (error) {
      // TODO: replace with custom exception later
      // TODO: add Logging methode
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateDto: DTO): Promise<RESPONSE_DTO | void> {
    try {
      return await this._service.partialUpdate(id, updateDto).then((entity) => entity?.toModel());
    } catch (error) {
      // TODO: replace with custom exception later
      // TODO: add Logging methode
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id') id: number,
    @Body() updateDto: DTO,
  ): Promise<RESPONSE_DTO | void> {
    try {
      return await this._service.partialUpdate(id, updateDto).then((entity) => entity?.toModel());
    } catch (error) {
      // TODO: replace with custom exception later
      // TODO: add Logging methode
      throw new InternalServerErrorException(error);
    }
  }
}
