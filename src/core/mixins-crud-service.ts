import { IMixinsCrudEntity } from './mixins-crud-entity-interface';
import { IMixinsCrudService } from './mixins-crud-service-interface';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class MixinsCrudService<
  DTO extends DeepPartial<ENTITY>,
  ENTITY extends IMixinsCrudEntity<RESPONSE_DTO>,
  RESPONSE_DTO,
> implements IMixinsCrudService<DTO, ENTITY>
{
  protected constructor(private readonly _repository: Repository<ENTITY>) {}

  async createEntity(dto: DTO): Promise<ENTITY> {
    const entity = this._repository.create(dto);
    return await this._repository.save(entity);
  }

  async deleteEntity(id: number | string): Promise<void> {
    await this._repository.delete(id);
  }

  async findAllEntities(): Promise<ENTITY[]> {
    return this._repository.find();
  }

  async findEntity(id: number | string): Promise<ENTITY | null> {
    const searchCriteria = {
      ['id']: id as unknown,
    } as FindOptionsWhere<ENTITY>;
    return await this._repository.findOneBy(searchCriteria);
  }

  async partialUpdate(id: number | string, dto: DTO): Promise<ENTITY> {
    const entity = await this.findEntity(id);
    if (entity) {
      const updatedEntity = this._repository.merge(entity, dto);
      return await this._repository.save(updatedEntity);
    } else {
      // TODO: Replace with custom exceptions later and better logging for errors //
      throw new NotFoundException(`Entity ${id} not found`);
    }
  }
}
