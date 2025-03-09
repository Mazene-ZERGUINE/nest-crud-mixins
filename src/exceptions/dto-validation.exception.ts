import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export class DTOValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        error: 'DTO Validation Error',
        message: errors.map((err: ValidationError) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
