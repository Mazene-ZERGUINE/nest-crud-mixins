import { IMixinsCrudService } from './mixins-crud-service-interface';
import { MixinsCrudEntity } from './mixins-crud-entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class MixinsCrudService<ENTITY extends MixinsCrudEntity>
  implements IMixinsCrudService<ENTITY>
{
  protected constructor(
    private readonly repository: Repository<ENTITY>,
    private readonly entity: ENTITY,
  ) {}

  private readonly relations: string[] = this.entity.getRelations();

  async createEntity(entity: DeepPartial<ENTITY>): Promise<ENTITY> {
    const newEntity: ENTITY = this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async deleteEntity(id: string | number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAllEntities(): Promise<ENTITY[]> {
    return await this.repository.find({ relations: this.relations });
  }

  async findEntity(id: string | number): Promise<ENTITY | null> {
    const searchCriteria = {
      ['id']: id as unknown,
    } as FindOptionsWhere<ENTITY>;
    return await this.repository.findOne({
      where: searchCriteria,
      relations: this.relations,
    });
  }

  async updateEntity(id: string | number, updateDto: DeepPartial<ENTITY>): Promise<ENTITY | null> {
    const entity = await this.findEntity(id);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    const updatedEntity = this.repository.merge(entity, updateDto);
    return await this.repository.save(updatedEntity);
  }
}
