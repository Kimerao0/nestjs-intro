import { AppConfig } from 'src/config/app.config';
import * as Joi from 'joi';

export interface ConfigType {
  app: AppConfig;
}

export const appConfigSchema = Joi.object({
  APP_MESSAGE_PREFIX: Joi.string().default('Config Missing'),
});
