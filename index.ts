import express, { Application } from 'express'
import fs from 'fs'
import multer from 'multer'
import cors from 'cors'
import mongoose from 'mongoose'

import { registerValidation, loginValidation, postCreateValidation } from './validations'
import { handleValidationErrors, checkAuth } from './utils'
import { UserController, PostController } from './controllers'

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app: Application = express()

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
  destination: (_: Express.Request, __: Express.Multer.File, cb: DestinationCallback): void => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_: Express.Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, file.originalname)
  },
})

app.use('/uploads', express.static('uploads'))

const upload = multer({ storage })

app.use(express.json())
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
//@ts-ignore
app.get('/auth/me', checkAuth, UserController.getMe)
//@ts-ignore
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file?.originalname}`,
  })
})

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
//@ts-ignore
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
//@ts-ignore
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
  '/posts/:id',
  //@ts-ignore
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
)

app.listen(process.env.PORT || 4444, () => {
  console.log('Server OK')
})
