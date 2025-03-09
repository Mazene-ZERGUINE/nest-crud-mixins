import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(message: string) {
    super(
      {
        error: 'Entity Not Found',
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
