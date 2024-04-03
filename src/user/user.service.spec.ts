import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe(UserService, () => {
  let userService: UserService;
  const mockUserRepository = {
    findManyAndCount: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeAll(async () => {
    // create a module with the UserService
    const module = await Test.createTestingModule({
      providers: [
        { provide: UserRepository, useValue: mockUserRepository },
        UserService,
      ],
    }).compile();

    // get the UserService instance
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
