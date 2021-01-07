import { createUser, getUserById, getUserByUsername, verifyUser } from "./auth"
import { pool } from "./db"

import { down, up } from "./migrations/001_init"

beforeAll(async () => {
  await up()
})

afterAll(async () => {
  await down()
  await pool.end()
})

describe('auth', () => {
  const username = 'zwhitchcox'
  const password = 'password'

  test('create user', async () => {
    const id = await createUser({username, password})
    const user = await getUserById(id)
    expect(user.username).toBe(username)
  })

  test('validate user', async () => {
    expect(await verifyUser(username, password)).toBe(true)
    expect(await verifyUser(username, 'asdfasd')).toBe(false)
  })
})

