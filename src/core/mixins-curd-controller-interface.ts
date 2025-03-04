import { DeepPartial } from 'typeorm';

export interface IMixinsCrudControllerInterface<ENTITY> {
  create(createDto: DeepPartial<ENTITY>): Promise<DeepPartial<ENTITY>>;
  getAll(): Promise<DeepPartial<ENTITY>[]>;
  getOne(id: number | string): Promise<DeepPartial<ENTITY> | undefined>;
  delete(id: number | string): Promise<void>;
  update(id: number | string, updateDto: DeepPartial<ENTITY>): Promise<DeepPartial<ENTITY>>;
  partialUpdate(id: number | string, updateDto: DeepPartial<ENTITY>): Promise<DeepPartial<ENTITY>>;
}
