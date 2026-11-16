import '../config/loadEnv.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
try {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first');
  if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  if (Buffer.byteLength(password, 'utf8') > 72) throw new Error('ADMIN_PASSWORD must not exceed 72 UTF-8 bytes');
  await connectDB();
  const hash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { email },
    { email, password: hash },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );
  console.log('Admin account provisioned; password stored as a bcrypt hash.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
