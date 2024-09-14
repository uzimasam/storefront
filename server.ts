import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const booking = await prisma.booking.create({
    data: {
        code: 'WE34-56UJ',
        first_name: 'Sam',
        last_name: 'Uzima',
        email: 'uzimasamuel1@gmail.com',
        phone_number: '0768415577',
        status: 'PENDING'
    }
});
console.log('Created new booking: ', booking);
}