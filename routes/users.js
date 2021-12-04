const express = require('express')
const router = express.Router()

require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// get a user by id
router.get('/:id', async (req, res) => {
    try {
      const {id} = req.params
        const user = await prisma.user.findUnique({
            where: {
              id: Number(id),
            },
          })
     res.json(user)
    } catch (error) {
        console.log(error)
    }
     })


// delete a user by id
router.delete('delete/:id', async (req, res) => {
    try {
      const {id} = req.params
        const user = await prisma.user.delete({
            where: {
              id: Number(id),
            },
          })
     res.json(`User ${user.id} was deleted!`)
    } catch (error) {
        console.log(error)
    }
     })



module.exports = router