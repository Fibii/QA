const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


router.get('/', async(request, response, next) => {

  try {
    const users = await User.find({})
        .populate({
          path: 'questions',
          model: 'Question',
          select: ['title', 'likes']
        })
    return response.json(users)
  } catch (error) {
    next(error)
  }

})


// used for a user page
router.get('/:id', async (request, response, next) => {

  try {
    const id = request.params.id;
    const user = await User.findById(id).populate({
      path: 'questions',
      model: 'Question',
      select: ['title', 'likes']
    })
    return response.json(user)
  } catch (error) {
    next(error)
  }

});

// used add a new user info
router.post('/', async(request, response, next) => {
  const body = request.body
  const salt = 10

  //todo: validate email
  if(body.password === undefined || body.username === undefined || body.email === undefined){
    response.status(400).send({
      error:'error: Both username and password and email must be given'
    })
    return
  }

  if(body.password.length < 3 || body.username.length < 3 || body.email.length < 6){
    response.status(400).send({
      error:'error: Both username and password must be at least 3 characters long and email must be bigger than 5'
    })
    return
  }

  try {
    const passwordHash = await bcrypt.hashSync(body.password, salt)

    const newUser = new User({
      username: body.username,
      passwordHash: passwordHash,
      email: body.email,
      dateOfBirth: body.dateOfBirth,
      registerDate: new Date(),
    })

    await newUser.save()
    return response.status(200).json(newUser);

  } catch (error) {
    next(error)
  }

});


//used to update a user's info
router.put('/:id', async (request, response, next) => {
  try {
    const body = request.body
    const id = request.params.id
    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id || decodedToken.id !== id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const isPasswordCorrect = user === null ?
        false : await bcrypt.compare(body.password, user.passwordHash)

    if(!isPasswordCorrect) {
      return response.status(401).json({error: 'wrong password'})
    }

    if(!body.email || !body.dateOfBirth || !body.fullname) {
      return response.status(401)
          .json({error: 'email, dateOfBirth, fullname must be provided'})
    }

    const updatedUserObj = {
      ...user._doc,
      email: body.email,
      dateOfBirth: body.dateOfBirth,
      location: body.location,
      fullname: body.fullname
    }
    const updatedUser = await User.findByIdAndUpdate(id, updatedUserObj)
    return response.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
})


// used to delete a user
router.delete('/:id',  async (request, response, next) => {
  try {
    const body = request.body
    const id = request.params.id
    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id || decodedToken.id !== id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const isPasswordCorrect = user === null ?
        false : await bcrypt.compare(body.password, user.passwordHash)

    if(!isPasswordCorrect) {
      return response.status(401).json({error: 'wrong password'})
    }

    await User.findByIdAndRemove(id)
    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router;
