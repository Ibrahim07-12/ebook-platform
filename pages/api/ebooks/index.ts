import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    category, 
    page = 1, 
    limit = 12, 
    sort = 'featured',
    search = '',
    price_range = 'all' 
  } = req.query;

  try {
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = 'WHERE e.is_active = TRUE';
    let orderClause = 'ORDER BY e.created_at DESC';
    const queryParams: any[] = [];

    // Category filter
    if (category && category !== 'all') {
      whereClause += ' AND c.slug = ?';
      queryParams.push(category);
    }

    // Search filter
    if (search) {
      whereClause += ' AND (e.title LIKE ? OR e.description LIKE ? OR e.author LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Price filter
    if (price_range === 'free') {
      whereClause += ' AND e.is_free = TRUE';
    } else if (price_range === 'paid') {
      whereClause += ' AND e.is_free = FALSE';
    }

    // Sort options
    switch (sort) {
      case 'featured':
        orderClause = 'ORDER BY e.is_featured DESC, e.created_at DESC';
        break;
      case 'newest':
        orderClause = 'ORDER BY e.created_at DESC';
        break;
      case 'rating':
        orderClause = 'ORDER BY e.rating DESC, e.rating_count DESC';
        break;
      case 'price_low':
        orderClause = 'ORDER BY e.price ASC';
        break;
      case 'price_high':
        orderClause = 'ORDER BY e.price DESC';
        break;
      case 'popular':
        orderClause = 'ORDER BY e.downloads_count DESC';
        break;
    }

    // Get ebooks with pagination
    const [ebooks] = await db.query(`
      SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        COALESCE(e.discount_price, e.price) as final_price
      FROM ebooks e
      LEFT JOIN categories c ON e.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `, [...queryParams, Number(limit), offset]);

    // Get total count for pagination
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total
      FROM ebooks e
      LEFT JOIN categories c ON e.category_id = c.id
      ${whereClause}
    `, queryParams);

    const total = (countResult as any[])[0]?.total || 0;
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        ebooks,
        pagination: {
          current_page: Number(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: Number(limit),
          has_next: Number(page) < totalPages,
          has_prev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Ebooks API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch ebooks' 
    });
  }
}
