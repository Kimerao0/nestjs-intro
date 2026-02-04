import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockedBcrypt = jest.mocked(bcrypt);
const hashMock = mockedBcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const compareMock = mockedBcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('returns hashed value from bcrypt', async () => {
      const hashedPassword = '$2b$10$hashedvalue';
      hashMock.mockResolvedValue(hashedPassword as never);

      const result = await service.hash('myPassword');

      expect(result).toBe(hashedPassword);
    });

    it('forwards password and salt rounds to bcrypt.hash', async () => {
      hashMock.mockResolvedValue('hashed' as never);

      await service.hash('myPassword');

      expect(hashMock).toHaveBeenCalledTimes(1);
      expect(hashMock).toHaveBeenCalledWith('myPassword', expect.any(Number));
    });

    it('propagates bcrypt errors', async () => {
      hashMock.mockRejectedValue(new Error('bcrypt error') as never);

      await expect(service.hash('password')).rejects.toThrow('bcrypt error');
    });
  });

  describe('verify', () => {
    it('returns true when passwords match', async () => {
      compareMock.mockResolvedValue(true as never);

      const result = await service.verify('plain', 'hashed');

      expect(result).toBe(true);
    });

    it('returns false when passwords do not match', async () => {
      compareMock.mockResolvedValue(false as never);

      const result = await service.verify('wrong', 'hashed');

      expect(result).toBe(false);
    });

    it('forwards plain and hashed passwords to bcrypt.compare', async () => {
      compareMock.mockResolvedValue(true as never);

      await service.verify('plainPassword', 'hashedPassword');

      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    });

    it('propagates bcrypt errors', async () => {
      compareMock.mockRejectedValue(new Error('bcrypt error') as never);

      await expect(service.verify('plain', 'hashed')).rejects.toThrow('bcrypt error');
    });
  });
});
