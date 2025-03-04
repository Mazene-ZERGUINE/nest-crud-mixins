export interface IMixinsCrudEntity<RESPONSE_DTO> {
  registerRelations(relation: string[]): void;
  getRelations(): string[];
}
