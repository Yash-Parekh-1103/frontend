import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const runMigration = async () => {
  const connectionString = process.env.DATABASE_URL!;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  // Create postgres client for migrations
  const migrationClient = postgres(connectionString, { max: 1 });

  try {
    console.log('🔄 Running migrations...');

    await migrate(drizzle(migrationClient), {
      migrationsFolder: './src/database/migrations',
    });

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await migrationClient.end();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration().catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
}

export default runMigration;