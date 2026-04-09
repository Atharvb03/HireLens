import express from 'express'
import Contact from '../models/Contact.js'

const router = express.Router()

router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const contact = new Contact({ name, email, message })
    await contact.save()

    res.status(201).json({ success: true, message: 'Message saved successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' })
  }
})

router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

export default router
