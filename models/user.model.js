import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  rol: { type: String, enum: ['ADMIN', 'EDITOR'], default: 'ADMIN' },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
