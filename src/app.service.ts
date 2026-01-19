import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly loggerService: LoggerService) {}
  getHello(): string {
    return this.loggerService.log('Hello World!');
  }
}
