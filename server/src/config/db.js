import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;


const dbUrl = new URL(process.env.DATABASE_URL);

// Create connection pool with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.on('connect', (client) => {
  //console.log('✅ Pool connected to:', client.host + ':' + client.port);
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client
const prisma = new PrismaClient({ 
  adapter,
  //log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Cleanup on shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
});

export default prisma;