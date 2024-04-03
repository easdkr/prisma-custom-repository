import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  public constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}
}
