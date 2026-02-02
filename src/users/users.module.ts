import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfig } from 'src/config/auth.config';
import { TypedConfigService } from 'src/config/type-config.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: TypedConfigService) =>
        ({
          secret: config.get<AuthConfig>('auth')?.jwt.secret,
          signOptions: {
            expiresIn: config.get<AuthConfig>('auth')?.jwt.expiresIn,
          },
        }) as JwtModuleOptions,
    }),
  ],
})
export class UsersModule {}
