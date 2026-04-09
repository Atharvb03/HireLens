import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const user = new User({ name, email, password, role })
    await user.save()

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user: { id: user._id, name, email, role } })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Validate role if provided
    if (role && user.role !== role) {
      return res.status(403).json({ error: 'Invalid role for this account' })
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
