import mongoose, { Document, Mixed } from 'mongoose'
import { User } from './User'

export interface Post extends Document {
  title: string
  text: string
  tags: Mixed
  viewsCount: number
  user: User
  imageUrl: string
}

const PostSchema = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<Post>('Post', PostSchema)
