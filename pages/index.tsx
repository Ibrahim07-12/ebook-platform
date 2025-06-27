import Head from 'next/head';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Pricing from '../components/Pricing';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import AuthModal from '../components/AuthModal';
import ManualPaymentModal from '../components/ManualPaymentModal';

interface Category {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  drive_link: string;
  ebooks_count: number;
  avg_rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleDownloadClick = () => {
    if (!session) {
      setIsAuthModalVisible(true);
    } else {
      // Redirect to ebooks page or show free ebooks
      window.location.href = '/ebooks?category=all&price_range=free';
    }
  };

  const handleCategoryPurchase = (category: Category) => {
    if (!session) {
      setIsAuthModalVisible(true);
      return;
    }
    
    setSelectedCategory(category);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentProof = async (categoryId: number, proofFile: File, paymentMethod: string) => {
    if (!session || !selectedCategory) return;

    const formData = new FormData();
    formData.append('proof', proofFile);
    formData.append('category_id', categoryId.toString());
    formData.append('payment_method', paymentMethod);
    formData.append('amount', selectedCategory.price.toString());

    try {
      const response = await fetch('/api/payment/manual', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Bukti transfer berhasil dikirim! Kami akan memverifikasi dalam 1 jam dan mengirim Google Drive link ke email Anda.');
        setIsPaymentModalVisible(false);
        setSelectedCategory(null);
      } else {
        alert('Gagal mengirim bukti transfer: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat mengirim bukti transfer');
    }
  };

  const handleSubscribe = async (planId: number, planName: string, price: number) => {
    if (!session) {
      setIsAuthModalVisible(true);
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'subscription',
          item_id: planId,
          amount: price,
          plan_name: planName
        }),
      });

      const data = await response.json();

      if (data.success && data.data.token) {
        // Initialize Midtrans Snap
        (window as any).snap.pay(data.data.token, {
          onSuccess: function(result: any) {
            alert('Pembayaran berhasil!');
            window.location.reload();
          },
          onPending: function(result: any) {
            alert('Menunggu pembayaran...');
          },
          onError: function(result: any) {
            alert('Pembayaran gagal!');
          },
          onClose: function() {
            console.log('Payment modal closed');
          }
        });
      } else {
        alert('Gagal membuat pembayaran: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>EbookHub - Platform Ebook Premium Indonesia</title>
        <meta 
          name="description" 
          content="Platform ebook terlengkap di Indonesia. Akses ribuan ebook premium dari berbagai kategori: digital marketing, keuangan, pendidikan, teknologi, dan banyak lagi." 
        />
        <meta name="keywords" content="ebook, digital marketing, keuangan, investasi, pendidikan, teknologi, programming, bisnis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Midtrans Snap */}
        <script
          type="text/javascript"
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true' 
            ? "https://app.midtrans.com/snap/snap.js" 
            : "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
      </Head>

      <Navbar onLoginClick={() => setIsAuthModalVisible(true)} />
      
      <main>
        <Hero onDownloadClick={handleDownloadClick} />
        <Categories onCategoryPurchase={handleCategoryPurchase} />
        <Features />
        <Pricing onSubscribe={handleSubscribe} />
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Mulai Perjalanan Belajar Anda
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat platform ebook terlengkap
            </p>
            <button
              onClick={handleDownloadClick}
              className="inline-flex items-center bg-white text-emerald-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Mulai Sekarang - Gratis
            </button>
          </div>
        </section>
      </main>

      <AuthModal 
        isVisible={isAuthModalVisible} 
        onClose={() => setIsAuthModalVisible(false)} 
      />

      {selectedCategory && (
        <ManualPaymentModal
          isOpen={isPaymentModalVisible}
          onClose={() => setIsPaymentModalVisible(false)}
          category={selectedCategory}
          onPaymentProof={handlePaymentProof}
        />
      )}

      {paymentLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Memproses pembayaran...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
