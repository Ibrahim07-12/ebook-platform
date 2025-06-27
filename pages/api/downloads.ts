import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import formidable from 'formidable';

// Parse x-www-form-urlencoded body manually
async function parseForm(req: NextApiRequest): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const parsed = Object.fromEntries(new URLSearchParams(data));
      resolve(parsed);
    });
    req.on('error', err => reject(err));
  });
}

// Parse JSON body manually
async function parseJSON(req: NextApiRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', err => reject(err));
  });
}

// Parse multipart/form-data
async function parseMultipart(req: NextApiRequest): Promise<Record<string, string>> {
  const form = formidable({});
  const [fields] = await form.parse(req);
  
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
  }
  return result;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Request received:', req.method, req.headers['content-type']);
    
    const contentType = req.headers['content-type'] || '';
    let name = '', email = '', product_id = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const parsed = await parseForm(req);
      console.log('Parsed Form Data (URL encoded):', parsed);
      name = parsed.name;
      email = parsed.email;
      product_id = parsed.product_id;
    } else if (contentType.includes('multipart/form-data')) {
      const parsed = await parseMultipart(req);
      console.log('Parsed Form Data (Multipart):', parsed);
      name = parsed.name;
      email = parsed.email;
      product_id = parsed.product_id;
    } else if (contentType.includes('application/json')) {
      const parsed = await parseJSON(req);
      console.log('Parsed JSON body:', parsed);
      name = parsed.name;
      email = parsed.email;
      product_id = parsed.product_id;
    } else {
      console.log('Unknown content type, trying to parse as JSON');
      try {
        const parsed = await parseJSON(req);
        name = parsed.name;
        email = parsed.email;
        product_id = parsed.product_id;
      } catch (error) {
        console.log('Failed to parse request body');
      }
    }

    console.log('Extracted data:', { name, email, product_id });

    if (!name || !email || !product_id) {
      console.log('Missing required fields');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Test database connection first
    console.log('Testing database connection...');
    await db.query('SELECT 1');
    console.log('Database connection successful');

    // Pastikan product_id yang digunakan valid atau hapus constraint
    // Untuk sementara, kita tidak akan mengecek foreign key
    const query = `
      INSERT INTO downloads (product_id, name, email, download_date)
      VALUES (?, ?, ?, NOW())
    `;
    
    console.log('Executing query with data:', [product_id, name, email]);
    const result = await db.query(query, [product_id, name, email]);
    console.log('Query executed successfully:', result);

    // Optional: redirect to thank you page
    return res.redirect(302, '/?success=1');
  } catch (error) {
    console.error('Error in downloads API:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database connection failed. Please make sure MySQL server is running.' 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: `Server error: ${error.message}` 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Unknown server error occurred' 
    });
  }
}
