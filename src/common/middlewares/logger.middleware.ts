import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;

    // This listener triggers AFTER the Exception Filter has sent the response
    response.on('finish', () => {
      const { statusCode } = response;
      const message = response.get('message') || '';

      const logMessage = `${method} ${originalUrl} ${statusCode} ${message}`;

      if (statusCode >= 400) {
        this.logger.error(logMessage); // Log as error if status is 4xx or 5xx
      }
    });

    next();
  }
}
