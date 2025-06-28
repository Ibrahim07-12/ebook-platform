import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Categories API called');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const [categories] = await db.query(`
      SELECT 
        c.*,
        COALESCE(COUNT(e.id), 0) as ebooks_count,
        COALESCE(AVG(e.rating), 0) as avg_rating
      FROM categories c
      LEFT JOIN ebooks e ON c.id = e.category_id AND e.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    console.log('Database query result:', categories);
    console.log('Categories count:', (categories as any[]).length);

    // Ensure numeric values are properly formatted
    const formattedCategories = (categories as any[]).map(category => {
      const formatted = {
        ...category,
        price: parseFloat(category.price) || 0,
        original_price: parseFloat(category.original_price) || 0,
        avg_rating: parseFloat(category.avg_rating) || 0,
        ebooks_count: parseInt(category.ebooks_count) || 0
      };
      
      // Debug log to check values
      console.log(`Category ${category.name}: price=${formatted.price}, original_price=${formatted.original_price}`);
      
      return formatted;
    });

    res.status(200).json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch categories' 
    });
  }
}
