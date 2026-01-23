import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}
  getHello(): string {
    const prefix = this.configService.get<string>('app.messagePrefix');
    return this.loggerService.log(`${prefix} Hello World!`);
  }
}
