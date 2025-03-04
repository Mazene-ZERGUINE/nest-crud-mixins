import { DeepPartial } from 'typeorm';

export interface IMixinsCrudService<ENTITY> {
  createEntity(entity: DeepPartial<ENTITY>): Promise<ENTITY>;
  findAllEntities(): Promise<ENTITY[]>;
  findEntity(id: string | number): Promise<ENTITY | null>;
  deleteEntity(id: string | number): void;
  updateEntity(id: string | number, entity: any): Promise<ENTITY | null>;
}
