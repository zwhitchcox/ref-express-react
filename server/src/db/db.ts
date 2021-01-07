import * as pg from 'pg'
import * as cp from 'child_process'
import { promisify } from 'util'
import * as dotenv from 'dotenv'
import { userInfo } from 'os'

dotenv.config()
if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_NAME = process.env.DATABASE_NAME + '-test'
}

const exec = promisify(cp.exec)
export const pool = new pg.Pool({
    user: userInfo().username,
    password: 'postgres',
    database: process.env.DATABASE_NAME,
});

export const createDb = async () => {
  await exec(`createdb ${process.env.DATABASE_NAME}`)
}

export const dropDb = async () => {
  await exec(`dropdb -f ${process.env.DATABASE_NAME}`)
}

export const runFile = async (p: string) => {
  await exec(`psql -d ${process.env.DATABASE_NAME} -f ${p}`)
}