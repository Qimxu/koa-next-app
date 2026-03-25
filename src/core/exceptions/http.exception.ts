export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'HttpException';
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(400, message, errors);
    this.name = 'BadRequestException';
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not found') {
    super(404, message);
    this.name = 'NotFoundException';
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictException';
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string = 'Too many requests') {
    super(429, message);
    this.name = 'TooManyRequestsException';
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal server error') {
    super(500, message);
    this.name = 'InternalServerErrorException';
  }
}
