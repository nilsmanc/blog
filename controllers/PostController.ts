import { UserAuthInfoRequest } from './../types'
import { Request, Response } from 'express'
import { Document } from 'mongoose'

import PostModel from '../models/Post'

export const getLastTags = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5)

    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить теги',
    })
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          })
        }
        res.json(doc)
      },
    ).populate('user')
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err: Error, doc: Document) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          })
        }

        res.json({
          success: true,
        })
      },
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const create = async (req: UserAuthInfoRequest, res: Response) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

export const update = async (req: UserAuthInfoRequest, res: Response) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    )

    res.json({
      success: true,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}
