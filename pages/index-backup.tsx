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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  ebooks_count: number;
  avg_rating: number;
}

export default function Home() {
  const { data: session } = useSession();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleDownloadClick = () => {
    if (!session) {
      setIsAuthModalVisible(true);
    } else {
      // Redirect to ebooks page or show free ebooks
      window.location.href = '/ebooks?category=all&price_range=free';
    }
  };

  const handleCategorySelect = (category: Category) => {
    // Redirect to ebooks page with selected category
    window.location.href = `/ebooks?category=${category.slug}`;
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

  const handleLoginClick = () => {
    setIsAuthModalVisible(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalVisible(false);
  };

  return (
    <>
      <Head>
        <title>Panduan Lengkap Digital Marketing untuk Pemula - Download Gratis</title>
        <meta name="description" content="Dapatkan ebook gratis berisi 150+ halaman strategi digital marketing terpercaya yang telah membantu ribuan bisnis meningkatkan penjualan hingga 300%." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar onLoginClick={handleLoginClick} />
      
      <main>
        <Hero onDownloadClick={handleDownloadClick} />
        <Features />
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Siap Mengubah Bisnis Anda?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Jangan lewatkan kesempatan emas ini. Download sekarang dan mulai transformasi digital bisnis Anda hari ini!
            </p>
            <button 
              onClick={handleDownloadClick}
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Ebook Gratis
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Digital Marketing Mastery</h3>
              <p className="text-gray-400 mb-6">
                Panduan terlengkap untuk menguasai digital marketing dari nol hingga mahir
              </p>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348c0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348c0 1.297-1.051 2.348-2.348 2.348z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  © 2024 Digital Marketing Mastery. Semua hak dilindungi.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <DownloadForm 
        isVisible={showDownloadForm} 
        onClose={handleCloseForm} 
      />

      <AuthModal 
        isVisible={showAuthModal} 
        onClose={handleCloseAuth} 
      />
    </>
  );
}
