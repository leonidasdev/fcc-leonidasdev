const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const crypto = require('crypto')

// In-memory data store
const users = [] // each user: { username, _id, log: [{description,duration,date}] }

// Create a new user
app.post('/api/users', (req, res) => {
  const username = req.body.username || req.query.username
  if (!username) return res.status(400).json({ error: 'username required' })
  const _id = crypto.randomBytes(8).toString('hex')
  const user = { username, _id, log: [] }
  users.push(user)
  res.json({ username: user.username, _id: user._id })
})

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ username: u.username, _id: u._id })))
})

// Add exercise to user
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params
  const user = users.find(u => u._id === _id)
  if (!user) return res.status(400).json({ error: 'unknown _id' })

  const description = req.body.description || req.query.description
  const duration = req.body.duration || req.query.duration
  const dateInput = req.body.date || req.query.date

  if (!description || !duration) return res.status(400).json({ error: 'description and duration required' })

  const durationNum = Number(duration)
  if (Number.isNaN(durationNum)) return res.status(400).json({ error: 'duration must be a number' })

  const dateObj = dateInput ? new Date(dateInput) : new Date()
  const dateStr = dateObj.toDateString()

  const exercise = { description, duration: durationNum, date: dateStr }
  user.log.push({ description, duration: durationNum, date: dateObj })

  res.json({ username: user.username, description, duration: durationNum, date: dateStr, _id: user._id })
})

// Get user logs with optional from, to, limit
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params
  const user = users.find(u => u._id === _id)
  if (!user) return res.status(400).json({ error: 'unknown _id' })

  const { from, to, limit } = req.query

  let log = user.log.map(item => ({ description: item.description, duration: item.duration, date: item.date.toDateString() }))

  if (from) {
    const fromDate = new Date(from)
    log = log.filter(l => new Date(l.date) >= fromDate)
  }
  if (to) {
    const toDate = new Date(to)
    log = log.filter(l => new Date(l.date) <= toDate)
  }
  if (limit) {
    const lim = Number(limit)
    if (!Number.isNaN(lim)) log = log.slice(0, lim)
  }

  res.json({ username: user.username, count: log.length, _id: user._id, log })
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
