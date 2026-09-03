import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const secret = process.env.JWT_SECRET || 'change-this-in-production';
const expiresIn = process.env.JWT_EXPIRE || '1d';
export const hashPassword = password => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash || '');
export const createToken = user => jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({detail:'Authentication required'});
    const payload = jwt.verify(header.slice(7), secret);
    const rows = await query('SELECT id,name,mobile,email,role,created_at FROM users WHERE id=?', [payload.sub]);
    if (!rows[0]) return res.status(401).json({detail:'Invalid or expired token'});
    req.user = rows[0]; next();
  } catch { return res.status(401).json({detail:'Invalid or expired token'}); }
}
export function lenderOnly(req,res,next){ if(!['lender','admin'].includes(req.user?.role)) return res.status(403).json({detail:'Lender access required'}); next(); }
export const publicUser = u => ({id:u.id,name:u.name,mobile:u.mobile,email:u.email ?? null,role:u.role});
