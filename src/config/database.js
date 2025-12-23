import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


if(process.env.NODE_ENV === 'development') {
    neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
    neonConfig.useSecureWebSocket = false;  
    neonConfig.poolQueryViaFetch = true;
}
const isNeonLocal = process.env.NEON_LOCAL === 'true';

if (isNeonLocal) {
	const host = process.env.NEON_LOCAL_PROXY_HOST || 'neon-local';
	const port = process.env.NEON_LOCAL_PROXY_PORT || '5432';

	// Neon Local uses HTTP fetch instead of WebSockets and a self-signed cert
	neonConfig.fetchEndpoint = `http://${host}:${port}/sql`;
	neonConfig.useSecureWebSocket = false;
	neonConfig.poolQueryViaFetch = true;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set');
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

export { db, sql };