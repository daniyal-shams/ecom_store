import { neon } from "@neondatabase/serverless";
import dotnev from  "dotenv";

dotnev.config();

const {PGHOST , PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require `
)