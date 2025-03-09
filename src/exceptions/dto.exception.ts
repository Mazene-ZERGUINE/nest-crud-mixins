import { HttpException, HttpStatus } from '@nestjs/common';

export class DTOException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ error: 'DTO Not found', message }, statusCode);
  }
}
