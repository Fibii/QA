const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


router.post('/', async (request, response, next) => {
  try {
    const username = request.body.username
    const password = request.body.password

    const user = await User.findOne({username})
    const isPasswordCorrect = user === null ?
        false : await bcrypt.compare(password, user.passwordHash)

    if (isPasswordCorrect) {
      const userTokenObj = {
        username: username,
        id: user.id
      }

      const token = jwt.sign(userTokenObj, process.env.SECRET)

      response.status(200)
          .json({username, token})

    } else {
      response.status(401)
          .json({
        error: "invalid password"
      })
    }
  } catch(error) {
    next(error)
  }
})


module.exports = router
