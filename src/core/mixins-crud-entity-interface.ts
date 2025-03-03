export interface IMixinsCrudEntity<RESPONSE_DTO> {
  toModel(): RESPONSE_DTO;
  getRelations(): string[];
}
