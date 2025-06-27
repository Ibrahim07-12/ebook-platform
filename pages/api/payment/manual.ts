import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, {});
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Get user data
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [session.user.email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0] as any;

    // Parse form data
    const form = formidable({
      uploadDir: './public/uploads/payment-proofs',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    // Ensure upload directory exists
    const uploadDir = './public/uploads/payment-proofs';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);

    const categoryId = Array.isArray(fields.category_id) ? fields.category_id[0] : fields.category_id;
    const paymentMethod = Array.isArray(fields.payment_method) ? fields.payment_method[0] : fields.payment_method;
    const amount = Array.isArray(fields.amount) ? fields.amount[0] : fields.amount;
    const proofFile = Array.isArray(files.proof) ? files.proof[0] : files.proof;

    if (!categoryId || !paymentMethod || !amount || !proofFile) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get category info
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const category = categories[0] as any;

    // Check if user already purchased this category
    const [existingPurchase] = await db.query(
      'SELECT * FROM category_purchases WHERE user_id = ? AND category_id = ? AND status = "completed"',
      [user.id, categoryId]
    );

    if (Array.isArray(existingPurchase) && existingPurchase.length > 0) {
      return res.status(400).json({ message: 'You have already purchased this category' });
    }

    // Generate unique payment ID
    const paymentId = `manual_${categoryId}_${user.id}_${Date.now()}`;

    // Save payment record
    await db.query(`
      INSERT INTO payments (
        user_id, payment_id, payment_method, type, amount, 
        reference_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      paymentId,
      paymentMethod,
      'category',
      parseFloat(amount),
      categoryId,
      'pending'
    ]);

    // Create category purchase record
    await db.query(`
      INSERT INTO category_purchases (
        user_id, category_id, amount, payment_id, status
      ) VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        amount = VALUES(amount),
        payment_id = VALUES(payment_id),
        status = VALUES(status)
    `, [
      user.id,
      categoryId,
      parseFloat(amount),
      paymentId,
      'pending'
    ]);

    // Store payment proof info
    const proofFileName = path.basename(proofFile.filepath);
    const proofUrl = `/uploads/payment-proofs/${proofFileName}`;

    await db.query(`
      INSERT INTO payment_proofs (
        payment_id, user_id, category_id, file_path, payment_method, 
        amount, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      paymentId,
      user.id,
      categoryId,
      proofUrl,
      paymentMethod,
      parseFloat(amount),
      'pending'
    ]);

    // TODO: Send notification to admin for verification
    // TODO: Setup webhook/cron for auto verification

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: {
        payment_id: paymentId,
        status: 'pending_verification'
      }
    });

  } catch (error) {
    console.error('Manual payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process manual payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
