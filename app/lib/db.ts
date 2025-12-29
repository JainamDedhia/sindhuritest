import { Pool } from 'pg'

/**
 * POSTGRESQL CONNECTION POOL
 * Manages database connections efficiently
 * Reuses connections instead of creating new ones for each query
 * 
 * Make sure to set DATABASE_URL in your .env file:
 * DATABASE_URL="postgresql://user:password@host:5432/database"
 */
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optional: Add connection pool settings
    max: 20, // Maximum number of connections
    idleTimeoutMillis: 30000, // How long a connection can be idle
    connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Test connection on startup (optional)
pool.on('connect', () => {
    console.log('✅ Database connected');
});

pool.on('error', (err) => {
    console.error('❌ Database error:', err);
});