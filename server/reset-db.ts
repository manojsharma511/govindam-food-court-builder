import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function reset() {
    await client.connect();
    console.log('Connected to database. Resetting public schema...');

    try {
        // Drop all tables in public schema
        await client.query('DROP SCHEMA public CASCADE');
        await client.query('CREATE SCHEMA public');
        console.log('Public schema reset successfully.');
    } catch (err) {
        console.error('Error resetting schema:', err);
    } finally {
        await client.end();
    }
}

reset();
