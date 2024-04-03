import { Logger, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    Logger,
    {
      provide: UserRepository,
      inject: [PrismaService, Logger],
      useFactory: (prismaService: PrismaService, logger: Logger) =>
        UserRepository(prismaService.user, logger),
    },
  ],
})
export class UserModule {}
