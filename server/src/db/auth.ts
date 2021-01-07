import { compare, genSalt, hash } from "bcrypt";
import { pool } from "./db"

type User = {
  username: string
  password: string
  first_name: string
  last_name: string
  email: string
}
export const createUser = async ({
  username,
  password,
  first_name,
  last_name,
  email,
}: User) => {
  const result = await pool.query(`
    INSERT INTO users(username, password, first_name, last_name, email)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [username, await hashPassword(password), first_name, last_name, email])
  return result.rows[0].id
}

export const hashPassword = async (password: string, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await genSalt(saltRounds);

        // Hash password
        return await hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
}

export const comparePassword = async (password: string, hash: string) => {
    try {
        // Compare password
        return await compare(password, hash);
    } catch (error) {
        console.log(error);
    }

    // Return false if error
    return false;
};

export const verifyUser = async ({username, password}: User) => {
  const user = await getUserByUsername(username)
  return await comparePassword(password, user.password)
}

export const getUserByUsername = async (username: string) => {
  const result = await pool.query(`
    SELECT * FROM users WHERE username=$1
  `, [username])
  return result.rows[0]
}

export const getUserById = async (id: number) => {
  const result = await pool.query(`
    SELECT * FROM users WHERE id=$1
  `, [id])
  return result.rows[0]
}

export const deleteUserByUsername = async (username: string) => (
  await pool.query(`
    DELETE from users
    WHERE username=$1
  `, [username])
)