import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';
import { ConfigType } from 'src/config/config.types';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}
  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.loggerService.log(`${prefix} Hello World!`);
  }
}
