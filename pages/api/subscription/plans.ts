import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [plans] = await db.query(`
      SELECT *
      FROM subscription_plans
      WHERE is_active = TRUE
      ORDER BY price ASC
    `);

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Subscription plans API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch subscription plans' 
    });
  }
}
