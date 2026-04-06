import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { hashPassword } from 'src/modules/auth/utils/helper';

const DEFAULT_PASSWORD = '123456';
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool, { schema: connectionString.split('=')[1] }); // get schema name
const prisma = new PrismaClient({ adapter });
async function main() {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
  await prisma.user.createMany({
    data: [
      {
        email: 'seller@gmail.com',
        avatarPublicId: '',
        fullName: 'Van Si',
        phone: '0987249005',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        email: 'admin@gmail.com',
        avatarPublicId: '',
        fullName: 'Hades',
        phone: '09928228282',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        email: 'devgame@gmail.com',
        avatarPublicId: '',
        fullName: 'HadesCoder',
        phone: '2323232323',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        email: 'tester@gmail.com',
        avatarPublicId: '',
        fullName: 'HadesTester',
        phone: '2323232323',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        email: 'Boss@gmail.com',
        avatarPublicId: '',
        fullName: 'HadesBoss',
        phone: '2323232323',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: true,
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
