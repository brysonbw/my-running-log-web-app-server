const express = require('express')
const cors = require('cors')
require('dotenv').config()

// user route 
const userRouter = require('./routes/users')
// log route
const logRouter = require('./routes/logs')
// auth route
const authRouter = require('./routes/auth')

const app = express()


// middleware
app.use(express.json())
app.use(cors())

// Routes

// auth
app.use('/api/auth', authRouter)
// users
app.use('/api/user', userRouter)
// logs
app.use('/api/user/runlog', logRouter)




const PORT = process.env.PORT || 3007
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})