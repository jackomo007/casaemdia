import { Pool } from "pg";

function getDefaultConnectionString() {
  return (
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/casaemdia?schema=public"
  );
}

function isSupabaseConnection(connectionString: string) {
  return (
    connectionString.includes(".supabase.co") ||
    connectionString.includes(".pooler.supabase.com")
  );
}

export function createPgPool(connectionString = getDefaultConnectionString()) {
  return new Pool({
    connectionString,
    ssl: isSupabaseConnection(connectionString)
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  });
}
