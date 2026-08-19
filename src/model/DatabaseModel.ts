import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseModel {
  private static pool: Pool;

  public static getPool(): Pool {
    if (!DatabaseModel.pool) {
      DatabaseModel.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'suasenha',
        database: process.env.DB_NAME || 'loja_informatica',
      });
    }
    return DatabaseModel.pool;
  }
}