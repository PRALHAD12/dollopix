// import 'dotenv/config';
// import { neon, neonConfig } from '@neondatabase/serverless';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const isNeonLocal = process.env.NEON_LOCAL === 'true';

// if (isNeonLocal) {
//   const host = process.env.NEON_LOCAL_PROXY_HOST || 'neon-local';
//   const port = process.env.NEON_LOCAL_PROXY_PORT || '5432';

//   console.log(`🔧 Configuring for Neon Local: ${host}:${port}`);
  
//   neonConfig.fetchEndpoint = `http://${host}:${port}/sql`;
//   neonConfig.useSecureWebSocket = false;
//   neonConfig.poolQueryViaFetch = true;
// }

// const databaseUrl = process.env.DATABASE_URL;

// console.log(`📡 Database URL: ${databaseUrl}`);
// console.log(`📡 Fetch endpoint: ${neonConfig.fetchEndpoint || 'default'}`);

// if (!databaseUrl) {
//   throw new Error('DATABASE_URL is not set');
// }

// const sql = neon(databaseUrl);

// async function migrate() {
//   try {
//     console.log('🚀 Starting migrations...');
    
//     console.log('📜 Creating users table...');
    
//     // Execute migration directly with template literal
//     await sql`
//       CREATE TABLE IF NOT EXISTS "users" (
//         "id" serial PRIMARY KEY NOT NULL,
//         "name" varchar(256) NOT NULL,
//         "email" varchar(256) NOT NULL,
//         "password" varchar(255) NOT NULL,
//         "role" varchar(50) DEFAULT 'user' NOT NULL,
//         "created_at" timestamp DEFAULT now() NOT NULL,
//         "updated_at" timestamp DEFAULT now() NOT NULL,
//         CONSTRAINT "users_email_unique" UNIQUE("email")
//       )
//     `;
    
//     console.log('✅ Migration completed successfully!');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Migration failed:', error);
//     process.exit(1);
//   }
// }

// migrate();
