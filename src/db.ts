import { Pool } from "pg";
import "dotenv/config";

const SECRETS = process.env;

const pool = new Pool({
  host: "localhost",
  user: SECRETS.DB_USERNAME,
  password: SECRETS.DB_PASSWORD,
  port: parseInt(SECRETS.DB_PORT!),
  database: "fys_database",
});

export default pool;
