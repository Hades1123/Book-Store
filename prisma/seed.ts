import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool, { schema: connectionString.split('=')[1] }); // get schema name
const prisma = new PrismaClient({ adapter });
async function main() {
  await prisma.user.create({
    data: {
      email: 'seller@gmail.com',
      avatarUrl: '',
      fullName: 'Van Si',
      phone: '0987249005',
      role: 'ADMIN',
      password: '123456',
    },
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
