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
    
    await prisma.$disconnect();
    await pool.end();
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