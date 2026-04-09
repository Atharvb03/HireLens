import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key')
    req.userId = decoded.userId
    req.role = decoded.role
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    next()
  }
}
