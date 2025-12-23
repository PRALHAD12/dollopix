import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';

const isNeonLocal = process.env.NEON_LOCAL === 'true';

if (isNeonLocal) {
  const host = process.env.NEON_LOCAL_PROXY_HOST || 'neon-local';
  const port = process.env.NEON_LOCAL_PROXY_PORT || '5432';

  neonConfig.fetchEndpoint = `http://${host}:${port}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
