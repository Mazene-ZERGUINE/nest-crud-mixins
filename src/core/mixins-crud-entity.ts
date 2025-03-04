export abstract class MixinsCrudEntity {
  protected _entityRelation: string[] = [];

  setRelations(relations: string[]) {
    this._entityRelation = relations;
  }

  getRelations(): string[] {
    return this._entityRelation;
  }
}
