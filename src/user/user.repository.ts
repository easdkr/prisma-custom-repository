/* eslint-disable @typescript-eslint/no-namespace */
import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export namespace Repository {
  export namespace User {
    export interface FindManyAndCountArgs {
      page: number;
      perPage: number;
      withDeleted?: boolean;
    }
  }
}

export function UserRepository(
  userClient: PrismaClient['user'],
  logger?: Logger,
) {
  logger?.verbose('UserRepository instantiated', 'UserRepository');
  return Object.assign(userClient, {
    async softDelete(id: number) {
      return userClient.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },
    async findManyAndCount(args: Repository.User.FindManyAndCountArgs) {
      const where = Prisma.validator<Prisma.UserWhereInput>()({
        deletedAt: args.withDeleted ? undefined : { equals: null },
      });

      const [items, count] = await Promise.all([
        userClient.findMany({
          where,
          skip: args.page * args.perPage,
          take: args.perPage,
        }),
        userClient.count({ where }),
      ]);

      return { items, count };
    },
  });
}

export type UserRepository = ReturnType<typeof UserRepository>;
