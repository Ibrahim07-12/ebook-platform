import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

export default function PaymentResult() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
  const { order_id, status_code, transaction_status } = router.query;

  useEffect(() => {
    if (router.isReady) {
      // Determine status based on URL params
      if (router.pathname.includes('success')) {
        setStatus('success');
      } else if (router.pathname.includes('pending')) {
        setStatus('pending');
      } else if (router.pathname.includes('error')) {
        setStatus('error');
      }
    }
  }, [router.isReady, router.pathname]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500 mx-auto" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto" />;
      default:
        return <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto"></div>;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Pembayaran Berhasil! 🎉',
          message: 'Terima kasih! Pembayaran Anda telah berhasil diproses. Anda sekarang dapat mengakses konten premium.',
          buttonText: 'Lihat Ebook Saya',
          buttonAction: () => router.push('/dashboard'),
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          title: 'Menunggu Pembayaran ⏳',
          message: 'Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi yang diberikan.',
          buttonText: 'Cek Status Pembayaran',
          buttonAction: () => window.location.reload(),
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'error':
        return {
          title: 'Pembayaran Gagal ❌',
          message: 'Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau hubungi customer service.',
          buttonText: 'Coba Lagi',
          buttonAction: () => router.push('/'),
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          title: 'Memproses...',
          message: 'Mohon tunggu, kami sedang memverifikasi status pembayaran Anda.',
          buttonText: '',
          buttonAction: () => {},
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <>
      <Head>
        <title>Status Pembayaran - EbookHub</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-2xl p-8 shadow-lg`}>
            {/* Status Icon */}
            <div className="mb-6">
              {getStatusIcon()}
            </div>

            {/* Status Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
              {statusInfo.title}
            </h1>

            {/* Status Message */}
            <p className="text-gray-600 text-center mb-6">
              {statusInfo.message}
            </p>

            {/* Order Details */}
            {order_id && (
              <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Detail Transaksi:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Order ID: <span className="font-mono">{order_id}</span></div>
                  {status_code && <div>Status Code: {status_code}</div>}
                  {transaction_status && <div>Status: {transaction_status}</div>}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {statusInfo.buttonText && (
                <button
                  onClick={statusInfo.buttonAction}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                    status === 'success' 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : status === 'pending'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {statusInfo.buttonText}
                </button>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-4 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Butuh bantuan?
            </p>
            <a 
              href="mailto:support@ebookhub.com" 
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Hubungi Customer Service
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
