import { validate } from 'class-validator';
import { CreateUserDto } from 'src/users/create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();
  beforeEach(() => {
    dto.email = 'test@test.com';
    dto.name = 'Gianni';
    dto.password = '123456';
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
});
