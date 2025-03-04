import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';

export type CrudQueryOptions<ENTITY> = {
  relations?: string[];
  relationLoadStrategy?: 'join' | 'query';
  order?: FindOptionsOrder<ENTITY>;
  transaction?: boolean;
};
