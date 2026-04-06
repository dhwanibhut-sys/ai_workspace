import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const documents = await prisma.document.findMany({
    include: { owner: true },
  });
  console.log('--- DOCUMENTS ---');
  documents.forEach((doc) => {
    console.log(`ID: ${doc.id}`);
    console.log(`Title: ${doc.title}`);
    console.log(`Owner: ${doc.owner?.email || 'N/A'} (ID: ${doc.ownerId})`);
    console.log('---');
  });
  
  const users = await prisma.user.findMany();
  console.log('--- USERS ---');
  users.forEach((user) => {
    console.log(`Email: ${user.email} (ID: ${user.id})`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
