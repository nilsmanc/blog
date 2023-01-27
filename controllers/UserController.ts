import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from '../models/User'

import { UserAuthInfoRequest, UserDocument } from '../types'

export const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = (await doc.save()) as UserDocument

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    )

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findOne({ email: req.body.email })) as UserDocument
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    )
    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}

export const getMe = async (req: UserAuthInfoRequest, res: Response) => {
  try {
    const user = (await UserModel.findById(req.userId)) as UserDocument
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }
    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Нет доступа',
    })
  }
}
