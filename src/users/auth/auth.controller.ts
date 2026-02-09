import { Body, ClassSerializerInterceptor, Controller, NotFoundException, Post, SerializeOptions, UseInterceptors, Request } from '@nestjs/common';
import { type AuthRequest } from 'src/users/auth/auth.request';
import { AuthResponse } from 'src/users/auth/auth.response';
import { AuthService } from 'src/users/auth/auth.service';
import { CreateUserDto } from 'src/users/create-user.dto';
import { LoginDto } from 'src/users/login.dto';
import { LoginResponse } from 'src/users/login.response';
import { User } from 'src/users/user.entity';
import { UserService } from 'src/users/user/user.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(loginDto.email, loginDto.password);
    return new LoginResponse({ accessToken });
  }

  @Post('/profile')
  public async profile(@Request() req: AuthRequest): Promise<User> {
    const user = await this.userService.findOneById(req.user.sub);

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
