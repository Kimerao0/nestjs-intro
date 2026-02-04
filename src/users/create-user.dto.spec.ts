import { validate } from 'class-validator';
import { CreateUserDto } from 'src/users/create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();
  beforeEach(() => {
    dto.email = 'test@test.com';
    dto.name = 'Gianni';
    dto.password = '123456A@';
  });
  it('validates complete valid data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
  it('should fail on invalid email', async () => {
    dto.email = 'test';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });
  it.each([
    {
      password: '123456@',
      expectedMessage: 'Password must contain at least 1 uppercase letter',
    },
    {
      password: 'abcdEFg@',
      expectedMessage: 'Password must contain at least 1 number',
    },
    {
      password: 'abcdEFg4',
      expectedMessage: 'Password must contain at least 1 special character',
    },
  ])('should fail password validation: $expectedMessage', async ({ password, expectedMessage }) => {
    dto.password = password;

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();

    const messages = Object.values(passwordError!.constraints ?? {});
    expect(messages).toContain(expectedMessage);
  });
});
