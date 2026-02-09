import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfig } from 'src/config/auth.config';
import { TypedConfigService } from 'src/config/type-config.service';
import { User } from 'src/users/user.entity';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PasswordService } from 'src/users/password/password.service';
import { AuthGuard } from 'src/users/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
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
  providers: [
    UserService,
    AuthService,
    PasswordService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class UsersModule {}
