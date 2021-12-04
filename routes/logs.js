const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const { validate } = require("../middleware/checkAuth");
const prisma = new PrismaClient()


// get all users and run logs
router.get('/all', async (req, res) => {
    try {
     const users = await prisma.user.findMany({
        include: { logs: true },
      })
     res.json(users)
    } catch (error) {
        console.log(error)
    }
     })



// user create run log
router.post('/create', validate, async (req, res) => {
  try {
    const {title,
      miles,
      duration,
      date,
      location,
  }  = req.body
  const postLog = await prisma.log.create({
      data: {
         title: title,
          miles: miles,
          duration: duration,
          date: date,
          location: location,
          user: { connect: { username: req.user.username },
      },
  }
  })
  res.json(postLog)
  } catch (error) {
    console.log(error)
  }
})

// user update run log
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateLog = await prisma.log.update({
      where: { id: Number(id) },
      data: req.body
    })
    res.json({message:`User ${updateLog.userId} running log updated!`, updateLog})
  } catch (error) {
    console.log(error)
  }
  })


// get a user run(s) log by user id
router.get('/:userId',  async (req, res) => {
  try {
    const  { userId } = req.params
    const userLog = await prisma.log.findMany({
      where: {
        userId: Number(userId)
      },
      select: {
        id: true,
        title   : true,
        miles   : true,
        location: true,
        duration: true,
        date    : true
      },
      // orderBy id - from latest to earliest
      orderBy: {
        id: 'desc'
    }
  });
    res.json(userLog)
  } catch (error) {
    console.log(error)
  }
  })

  // get a run log by id
  router.get('/log/:id',  async (req, res) => {
    try {
      const { id } = req.params
      const runLog = await prisma.log.findUnique({
        where: { id: Number(id) }
      });
      res.json(runLog)
    } catch (error) {
      console.log(error)
    }
    })


  // delete run log
  router.delete(`/delete/:id`, async (req, res) => {
    try {
      const { id } = req.params
     const deleteRunLog =  await prisma.log.delete({
        where: { id: Number(id) },
      })
      res.json(`User ${deleteRunLog.userId} running log (Number id: ${deleteRunLog.id}) was deleted!`)
    } catch (error) {
      console.log(error)
    }
  })


module.exports = router