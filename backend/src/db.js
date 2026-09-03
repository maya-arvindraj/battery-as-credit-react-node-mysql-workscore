import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const url = new URL(
  process.env.DATABASE_URL || 'mysql://root@localhost:3306/battery_credit'
);

export const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: url.password ? decodeURIComponent(url.password) : '',
  database: url.pathname.replace(/^\/+/, ''),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function transaction(fn) {
  const c = await pool.getConnection();

  try {
    await c.beginTransaction();
    const r = await fn(c);
    await c.commit();
    return r;
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
}