import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function PaymentHistory() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchPaymentHistory();
    }
  }, [session]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payment/history');
      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p>Please login to view payment history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Riwayat Pembayaran</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Belum ada riwayat pembayaran</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment: any) => (
              <div key={payment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{payment.category_name || payment.item_name}</h3>
                    <p className="text-gray-600">Order ID: {payment.payment_id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(payment.amount)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'completed' ? 'Berhasil' : 
                       payment.status === 'pending' ? 'Menunggu' : 'Gagal'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
