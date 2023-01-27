import mongoose, { Document } from 'mongoose'

export interface User extends Document {
  fullName: string
  email: string
  passwordHash: string
  avatarUrl: string
}

const UserSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<User>('User', UserSchema)
