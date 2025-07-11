import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
// import dontenv from 'dotenv';

// dontenv.config();

export const sql = neon(process.env.DATABASE_URL);
