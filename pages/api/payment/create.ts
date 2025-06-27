import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Midtrans configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const MIDTRANS_BASE_URL = MIDTRANS_IS_PRODUCTION 
  ? 'https://app.midtrans.com' 
  : 'https://app.sandbox.midtrans.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, {});
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { type, item_id, amount, plan_name, ebook_title, category_name, payment_method } = req.body;

  if (!type || !item_id || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
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

    // For category purchases, check if user already purchased this category
    if (type === 'category') {
      const [existingPurchase] = await db.query(
        'SELECT * FROM category_purchases WHERE user_id = ? AND category_id = ? AND status = "completed"',
        [user.id, item_id]
      );

      if (Array.isArray(existingPurchase) && existingPurchase.length > 0) {
        return res.status(400).json({ message: 'You have already purchased this category' });
      }
    }

    // Generate unique order ID
    const orderId = `${type}_${item_id}_${user.id}_${Date.now()}`;

    // Prepare transaction details
    const transactionDetails = {
      order_id: orderId,
      gross_amount: amount
    };

    // Prepare item details
    let itemName = '';
    if (type === 'subscription') {
      itemName = plan_name;
    } else if (type === 'category') {
      itemName = `Akses Kategori: ${category_name}`;
    } else {
      itemName = ebook_title;
    }

    const itemDetails = [{
      id: item_id.toString(),
      price: amount,
      quantity: 1,
      name: itemName,
      category: type === 'subscription' ? 'Subscription' : type === 'category' ? 'Category Access' : 'Ebook'
    }];

    // Prepare customer details
    const customerDetails = {
      first_name: user.name || 'User',
      email: user.email,
      phone: user.phone || ''
    };

    // Configure payment methods based on user selection
    let enabledPayments = [
      'gopay',         
      'shopeepay',     
      'qris',          
      'mandiri_va',    
      'bca_va',        
      'bni_va',        
      'bri_va',        
      'permata_va',    
      'alfamart',      
      'indomaret',     
      'mandiri_clickpay', 
      'cimb_clicks',   
      'bca_klikbca',   
      'bca_klikpay',   
      'bri_epay',      
      'echannel',
      'credit_card'
    ];

    // If specific payment method is selected, prioritize it
    if (payment_method) {
      enabledPayments = enabledPayments.filter(method => method === payment_method || method === 'credit_card');
      enabledPayments.unshift(payment_method);
    }

    // Prepare payment request with prioritized payment methods
    const parameter = {
      transaction_details: transactionDetails,
      item_details: itemDetails,
      customer_details: customerDetails,
      // Configured payment methods
      enabled_payments: enabledPayments,
      // Payment method configuration
      payment_type: 'mixed',
      // Custom expiry (24 hours)
      custom_expiry: {
        order_time: new Date().toISOString(),
        expiry_duration: 1440, // 24 hours in minutes
        unit: 'minute'
      },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/payment/success`,
        error: `${process.env.NEXTAUTH_URL}/payment/error`,
        pending: `${process.env.NEXTAUTH_URL}/payment/pending`
      }
    };

    // Create transaction token
    const authString = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
    
    const response = await fetch(`${MIDTRANS_BASE_URL}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(parameter)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error_messages?.[0] || 'Payment gateway error');
    }

    // Save payment record
    await db.query(`
      INSERT INTO payments (
        user_id, payment_id, payment_method, type, amount, 
        reference_id, gateway_response, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      orderId,
      'midtrans',
      type,
      amount,
      item_id,
      JSON.stringify(result),
      'pending'
    ]);

    // For category purchases, create a pending category purchase record
    if (type === 'category') {
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
        item_id,
        amount,
        orderId,
        'pending'
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        token: result.token,
        redirect_url: result.redirect_url,
        order_id: orderId
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
