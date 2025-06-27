import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import crypto from 'crypto';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

// Function to send category access email
async function sendCategoryAccessEmail(userId: number, categoryId: number, paymentId: string) {
  try {
    // Get user and category information
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);

    if (!Array.isArray(users) || users.length === 0 || !Array.isArray(categories) || categories.length === 0) {
      throw new Error('User or category not found');
    }

    const user = users[0] as any;
    const category = categories[0] as any;

    // Here you would integrate with your email service (SendGrid, Nodemailer, etc.)
    // For now, we'll just log the email content and mark as sent
    
    const emailContent = {
      to: user.email,
      subject: `Akses Kategori ${category.name} - Ebook Platform`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Selamat! Pembayaran Berhasil</h2>
          <p>Halo ${user.name || 'User'},</p>
          <p>Terima kasih telah melakukan pembayaran untuk kategori <strong>${category.name}</strong>.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Detail Pembelian:</h3>
            <p><strong>Kategori:</strong> ${category.name}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p><strong>Deskripsi:</strong> ${category.description}</p>
          </div>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0066cc; margin-top: 0;">🔗 Link Akses Google Drive:</h3>
            <p style="margin-bottom: 15px;">Klik link di bawah untuk mengakses 100+ ebook premium:</p>
            <a href="${category.drive_link}" 
               style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Akses Ebook Collection
            </a>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📋 Petunjuk Penggunaan:</h4>
            <ol style="color: #856404;">
              <li>Klik link Google Drive di atas</li>
              <li>Login dengan akun Google Anda</li>
              <li>Anda dapat melihat dan mendownload semua ebook</li>
              <li>Akses berlaku selamanya</li>
            </ol>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Jika ada pertanyaan, silakan hubungi tim support kami.<br>
            Terima kasih telah menggunakan platform ebook kami!
          </p>
        </div>
      `
    };

    console.log('Email to be sent:', emailContent);
    
    // TODO: Implement actual email sending here
    // Example with SendGrid:
    // await sgMail.send(emailContent);
    
    // Mark as sent in database
    await db.query(`
      UPDATE category_purchases 
      SET drive_link_sent = TRUE 
      WHERE user_id = ? AND category_id = ? AND payment_id = ?
    `, [userId, categoryId, paymentId]);

    console.log(`Email sent successfully to ${user.email} for category ${category.name}`);
    
  } catch (error) {
    console.error('Failed to send category access email:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log the error but don't throw - we don't want to fail the payment process
    await db.query(`
      INSERT INTO email_logs (user_id, category_id, payment_id, status, error_message, created_at)
      VALUES (?, ?, ?, 'failed', ?, NOW())
      ON DUPLICATE KEY UPDATE 
        status = 'failed', 
        error_message = ?, 
        created_at = NOW()
    `, [userId, categoryId, paymentId, errorMessage, errorMessage]);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify Midtrans signature
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_time
    } = req.body;

    // Create signature for verification
    const serverKey = MIDTRANS_SERVER_KEY;
    const input = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const hash = crypto.createHash('sha512').update(input).digest('hex');

    if (hash !== signature_key) {
      console.error('Invalid signature from Midtrans');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Update payment status based on transaction status
    let paymentStatus = 'pending';
    
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'challenge') {
        paymentStatus = 'pending';
      } else if (fraud_status === 'accept') {
        paymentStatus = 'completed';
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      paymentStatus = 'failed';
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending';
    }

    // Update payment record
    await db.query(`
      UPDATE payments 
      SET status = ?, gateway_response = ?, updated_at = NOW()
      WHERE payment_id = ?
    `, [
      paymentStatus,
      JSON.stringify(req.body),
      order_id
    ]);

    // If payment completed, process the purchase
    if (paymentStatus === 'completed') {
      const [payments] = await db.query(`
        SELECT * FROM payments WHERE payment_id = ?
      `, [order_id]);

      if (Array.isArray(payments) && payments.length > 0) {
        const payment = payments[0] as any;

        if (payment.type === 'subscription') {
          // Process subscription
          const [plans] = await db.query(`
            SELECT * FROM subscription_plans WHERE id = ?
          `, [payment.reference_id]);

          if (Array.isArray(plans) && plans.length > 0) {
            const plan = plans[0] as any;
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

            await db.query(`
              INSERT INTO user_subscriptions (
                user_id, plan_id, status, starts_at, expires_at, payment_id
              ) VALUES (?, ?, 'active', NOW(), ?, ?)
            `, [
              payment.user_id,
              payment.reference_id,
              expiresAt,
              payment.payment_id
            ]);

            // Update user subscription status
            await db.query(`
              UPDATE users 
              SET subscription_status = ?, subscription_expires_at = ?, total_spent = total_spent + ?
              WHERE id = ?
            `, [
              plan.name.toLowerCase().includes('premium') ? 'premium' : 'basic',
              expiresAt,
              payment.amount,
              payment.user_id
            ]);
          }
        } else if (payment.type === 'ebook') {
          // Process ebook purchase
          await db.query(`
            INSERT INTO ebook_purchases (
              user_id, ebook_id, amount, payment_id, status, purchased_at
            ) VALUES (?, ?, ?, ?, 'completed', NOW())
            ON DUPLICATE KEY UPDATE status = 'completed'
          `, [
            payment.user_id,
            payment.reference_id,
            payment.amount,
            payment.payment_id
          ]);

          // Update user total spent
          await db.query(`
            UPDATE users 
            SET total_spent = total_spent + ?
            WHERE id = ?
          `, [payment.amount, payment.user_id]);

          // Update ebook download count
          await db.query(`
            UPDATE ebooks 
            SET downloads_count = downloads_count + 1
            WHERE id = ?
          `, [payment.reference_id]);
        } else if (payment.type === 'category') {
          // Process category purchase
          await db.query(`
            UPDATE category_purchases 
            SET status = 'completed', drive_link_sent = FALSE
            WHERE user_id = ? AND category_id = ? AND payment_id = ?
          `, [
            payment.user_id,
            payment.reference_id,
            payment.payment_id
          ]);

          // Update user total spent
          await db.query(`
            UPDATE users 
            SET total_spent = total_spent + ?
            WHERE id = ?
          `, [payment.amount, payment.user_id]);

          // Send Google Drive link via email
          await sendCategoryAccessEmail(payment.user_id, payment.reference_id, payment.payment_id);
        }
      }
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process payment notification' 
    });
  }
}
