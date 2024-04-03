import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository';

describe(UserRepository, () => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://postgres:postgres@localhost:5432/postgres`,
      },
    },
  });

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$queryRaw`TRUNCATE "user" CASCADE`;
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(UserRepository(prisma.user)).toBeDefined();
  });

  it('should soft delete a user', async () => {
    // given
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: 'password',
      },
    });

    // when
    await UserRepository(prisma.user).softDelete(user.id);

    // then
    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(deletedUser.deletedAt).toEqual(expect.any(Date));
  });

  it('should find many users', async () => {
    // given
    await prisma.user.createMany({
      data: new Array(10).fill(0).map(() => ({
        email: `${Math.random().toString(36).substring(7)}@test.com`,
        password: 'password',
      })),
    });

    // when
    const users = await UserRepository(prisma.user).findManyAndCount({
      page: 0,
      perPage: 5,
    });

    // then
    expect(users.items).toHaveLength(5);
    expect(users.count).toBeGreaterThanOrEqual(5);
  });
});
