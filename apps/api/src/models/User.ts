import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import openDb from '../db/db';

export const createUser = async (user: PlatformUser) => {
  const db = await openDb();
  
  // Hash the password before saving it to the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  // Insert the new user. ID is omitted since SQLite auto-increments it.
  const result = await db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [user.email, hashedPassword]
  );
  
  await db.close();
  
  // Return the user with the newly generated auto-incremented ID
  return { ...user, id: result.lastID };
};

export const findUserById = async (id: string): Promise<PlatformUser | null> => {
  const db = await openDb();
  const user = await db.get<PlatformUser>('SELECT * FROM users WHERE id = ?', id);
  await db.close();
  return user || null;
};

/**
 * Compares a plain text password with a hashed password.
 * ...
 */
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword); 
};