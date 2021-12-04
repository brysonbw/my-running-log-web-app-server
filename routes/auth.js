const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt= require('jsonwebtoken')
const jwtDecode = require('jwt-decode')

require('dotenv').config()

const { PrismaClient, Prisma } = require('@prisma/client')
const { validate } = require('../middleware/checkAuth')
const prisma = new PrismaClient()

// signup user
router.post('/signup', [
    // check password length > min 7 char
    check('password', 'Please enter a password that is greater than 7 characters.')
    .isLength({
        min: 7
    }),
    check('username', 'Please enter a username that has a min: of 3 characters & max: 20 characters')
    .isLength({
        min: 3,
        max: 20
    }),
], async (req, res) => {
   const { password, username } = req.body
   const errors = validationResult(req)

   // validate input 
   if(!errors.isEmpty()) {
       return res.status(400).json({
           errors: errors.array()
       })
   }

    // hash password
    // save to database if valid
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashPassword
            }
        })

        return res.json(`${user.username} is registered!`)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // send error - if username already exist
            if (error.code === 'P2002') {
              return res.status(400).send(
                'Sorry, that user already exist - please enter a different username.'
              )
            }
          }
    }
})


// login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        // error > if username does not match
        if (!user) {
            return res.json({error: 'User does not exist'})
        }
        // error > if password does not match - hashPassword
        // compare hashPassword to user password
       const valid = await bcrypt.compare(password, user.password)
       if (!valid) {
        return res.json({error: 'Password does not match'})
       }
    
       // create access token
       const accessToken = jwt.sign(
        { username: user.username, id: user.id },
        `${process.env.ACCESS_SECRET}`, 
            { expiresIn: "15m" },
       )

       const decodedToken = jwtDecode(accessToken)
       const expiresAt = decodedToken.exp
    
       res.json({ token: accessToken, username: user.username , id: user.id,  expiresAt })
    } catch (error) {
        console.log(error)
    }
})


// check if user is auth
router.get("/me", validate, async (req, res) => {
        res.json(req.user)
  }); 
  

module.exports = router