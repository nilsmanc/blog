import { Request } from 'express'
import mongoose from 'mongoose'
import { User } from './models/User'

export interface UserAuthInfoRequest extends Request {
  userId: string
}

export interface JwtPayload {
  _id: string
}

export interface UserDocument extends User, mongoose.Document {
  createdAt: Date
  updatedAt: Date
  _doc?: any
}
