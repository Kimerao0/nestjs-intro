import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { AuthResponse } from 'src/users/auth/auth.response';
import { AuthService } from 'src/users/auth/auth.service';
import { CreateUserDto } from 'src/users/create-user.dto';
import { LoginDto } from 'src/users/login.dto';
import { LoginResponse } from 'src/users/login.response';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(loginDto.email, loginDto.password);
    return new LoginResponse({ accessToken });
  }
}
