// test-connection.js
import { PrismaClient } from './src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

console.log('Setting up PostgreSQL connection with Prisma v7...\n');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Create Prisma Client with the adapter
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':***@'));
    console.log('');
    
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ Query successful!');
    console.log('   Current time:', result[0].current_time);
    console.log('   PostgreSQL version:', result[0].db_version.split(',')[0]);
    console.log('');
    
    // Test querying a table
    const users = await prisma.user.findMany();
    console.log('✅ Can query User table');
    console.log('   Users in database:', users.length);
    
    console.log('\n✅ Everything works! Prisma v7 is configured correctly.');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error:', error.message);
    if (error.code) {
      console.error('Code:', error.code);
    }
  }
}

testConnection();

// test-insert.js
async function testInserts() {
  try {
    console.log('🧪 Testing Prisma Inserts\n');

    // 1. Create a user
    console.log('1. Creating a user...');
    const user = await prisma.user.create({
      data: {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'hashed_password_here'  // In real app, use bcrypt
      }
    });
    console.log('✅ User created:', user);
    console.log('');

    // 2. Create another user
    console.log('2. Creating another user...');
    const user2 = await prisma.user.create({
      data: {
        username: 'john',
        email: 'john@example.com',
        password: 'hashed_password_123'
      }
    });
    console.log('✅ User created:', user2);
    console.log('');

    // 3. Create a room (with relationship to user)
    console.log('3. Creating a room...');
    const room = await prisma.room.create({
      data: {
        name: 'Chill Vibes',
        ownerId: user.id  // Link to the first user
      }
    });
    console.log('✅ Room created:', room);
    console.log('');

    // 4. Create a room with nested user creation
    console.log('4. Creating room with new owner...');
    const roomWithOwner = await prisma.room.create({
      data: {
        name: 'Party Room',
        owner: {
          create: {
            username: 'bob',
            email: 'bob@example.com',
            password: 'hashed_password_456'
          }
        }
      },
      include: {
        owner: true  // Include the owner in the result
      }
    });
    console.log('✅ Room with owner created:', roomWithOwner);
    console.log('');

    // 5. View all users
    console.log('5. Fetching all users...');
    const allUsers = await prisma.user.findMany();
    console.log(`✅ Total users: ${allUsers.length}`);
    allUsers.forEach(u => {
      console.log(`   - ${u.username} (${u.email})`);
    });
    console.log('');

    // 6. View all rooms with owners
    console.log('6. Fetching all rooms with owners...');
    const allRooms = await prisma.room.findMany({
      include: {
        owner: true
      }
    });
    console.log(`✅ Total rooms: ${allRooms.length}`);
    allRooms.forEach(r => {
      console.log(`   - ${r.name} (owned by ${r.owner.username})`);
    });
    console.log('');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testInserts();

