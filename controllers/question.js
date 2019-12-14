const express = require('express')
const router = express.Router()
const Question = require('../models/question')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.get('/', async (request, response, next) => {
  try {
    const questions = await Question.find({})
    return response.json(questions)
  } catch (error) {
    next(error)
  }
})

// used to show a question in frontend
router.get('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const question = await Question.findById(id)
    if (question) {
      return response.json(question)
    } else {
      return response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// create a new question
router.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    // if the token is invalid
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.title || !body.content) {
      return response.status(401)
          .json({ error: 'title and content must be provided' })
    }

    const newQuestion = new Question({
      title: body.title,
      content: body.content,
      solved: false,
      likes: 0,
      postedDate: new Date(),
      tags: body.tags ? body.tags : [],
      postedBy: user.id
    })

    const question = await newQuestion.save()

    // add the question to the user's questions
    user.questions.push(question._id)
    await User.findByIdAndUpdate(user.id, user)

    return response.status(201)
        .json(question)

  } catch (error) {
    next(error)
  }
})


router.post('/:id/title-content', async (request, response, next) => {
  try {
    const body = request.body
    const id = request.params.id
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'a questions can be deleted by authors only' })
    }

    const updatedQuestion = {
      ...question._doc,
      title: body.title,
      content: body.content
    }

    await Question.findByIdAndUpdate(id, updatedQuestion)
    return response.status(303).end()

  } catch (error) {
      next(error)
  }
})

// delete a question
router.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'a questions can be deleted by authors only' })
    }

    await Question.findByIdAndRemove(id)
    return response.status(204).end()

  } catch (error) {
    next(error)
  }
})

module.exports = router
