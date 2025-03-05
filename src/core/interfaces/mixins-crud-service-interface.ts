import { DeepPartial } from 'typeorm';
import { FilterOptions } from './filter-options';

export interface IMixinsCrudService<ENTITY> {
  createEntity(entity: DeepPartial<ENTITY>): Promise<ENTITY>;
  findAllEntities(filterOptions?: FilterOptions): Promise<ENTITY[]>;
  findEntity(id: string | number): Promise<ENTITY | null>;
  deleteEntity(id: string | number): void;
  updateEntity(id: string | number, entity: any): Promise<ENTITY | null>;
}
