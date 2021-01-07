import { pool } from "./db"
import { randomBytes } from 'crypto'
import { promisify } from "bluebird"

export const createSession = async (username: string) => {
  const token = (await promisify(randomBytes)(48)).toString('hex')
  await pool.query(`
    INSERT INTO sessions(username, token)
    VALUES ($1, $2)
  `, [username, token])
  return token
}

export const getSession = async (token: string) => {
  const result = await pool.query(`
    SELECT * FROM sessions WHERE token=$1
  `, [token])
  if (result.rows.length) {
    return result.rows[0]
  }
}