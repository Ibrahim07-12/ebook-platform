import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const token = req.cookies['auth-token'];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    // Get user from database
    const [users] = await db.query(
      'SELECT id, name, email, avatar FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = users[0] as any;

    return res.status(200).json({ 
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
}
