import { User } from 'src/users/user.entity';

export class AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}
