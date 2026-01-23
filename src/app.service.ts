import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { TypedConfigService } from 'src/config/type-config.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: TypedConfigService,
  ) {}
  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.loggerService.log(`${prefix} Hello World!`);
  }
}
