import { pool } from "../db"

export const up = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial primary key,
      username text not null unique,
      password text not null,
      first_name text,
      last_name text,
      verified boolean,
      email text,
      created_at TIME DEFAULT CURRENT_TIME,
      created_on DATE DEFAULT CURRENT_DATE
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id serial primary key,
      username text not null,
      token text not null,
      created_at TIME DEFAULT CURRENT_TIME,
      created_on DATE DEFAULT CURRENT_DATE
    );
  `)
}

export const down = async () => {
  await pool.query(`
    DROP TABLE users;
    DROP TABLE sessions;
  `)
}