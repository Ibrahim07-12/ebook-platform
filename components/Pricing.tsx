import { useState, useEffect } from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

interface PricingProps {
  onSubscribe: (planId: number, planName: string, price: number) => void;
}

export default function Pricing({ onSubscribe }: PricingProps) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (!session) {
      // Show login modal
      alert('Silakan login terlebih dahulu');
      return;
    }
    
    setSelectedPlan(plan.id);
    onSubscribe(plan.id, plan.name, plan.price);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded mt-8"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Pilih Paket Berlangganan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dapatkan akses unlimited ke ribuan ebook premium dengan harga terjangkau
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.is_popular
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl scale-105'
                  : 'bg-gray-50 border border-gray-200 shadow-sm'
              } transition-all duration-300 hover:shadow-lg`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Paling Populer</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  {plan.is_popular ? (
                    <Star className="w-8 h-8 text-yellow-500 fill-current" />
                  ) : (
                    <Zap className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {formatPrice(plan.price)}
                </div>
                <div className="text-gray-600 text-sm">
                  per {plan.duration_days === 30 ? 'bulan' : 'tahun'}
                </div>
                {plan.duration_days === 365 && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium mt-2">
                    Hemat 17%
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className={`w-5 h-5 mt-0.5 ${
                      plan.is_popular ? 'text-blue-600' : 'text-green-500'
                    } flex-shrink-0`} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={selectedPlan === plan.id}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
              >
                {selectedPlan === plan.id ? 'Memproses...' : 'Berlangganan Sekarang'}
              </button>

              {plan.duration_days === 30 && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Dapat dibatalkan kapan saja
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Payment methods info */}
        <div className="mt-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Metode Pembayaran yang Didukung
          </h3>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Bayar dengan mudah menggunakan metode pembayaran favorit Anda
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* E-Wallet - Priority Payment Methods */}
            <div className="text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-green-200 mb-4 relative">
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  POPULER
                </div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <span className="mr-2">📱</span>
                  E-Wallet & QRIS
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">Go</span>
                    </div>
                    <span className="text-sm font-medium">GoPay</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">#1</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-2 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">SP</span>
                    </div>
                    <span className="text-sm font-medium">ShopeePay</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">#2</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">QR</span>
                    </div>
                    <span className="text-sm font-medium">QRIS</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">#3</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Virtual Account */}
            <div className="text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <span className="mr-2">🏦</span>
                  Transfer Bank (VA)
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="text-sm font-medium">Mandiri</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Prioritas</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>BCA</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BNI</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BRI</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Permata</span>
                      <span className="text-green-600">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Retail & Others */}
            <div className="text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <span className="mr-2">🏪</span>
                  Retail & Lainnya
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2 p-2 bg-red-50 rounded-lg">
                    <span className="text-lg">🏪</span>
                    <span className="font-medium">Indomaret</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 p-2 bg-blue-50 rounded-lg">
                    <span className="text-lg">🏪</span>
                    <span className="font-medium">Alfamart</span>
                  </div>
                  <div className="text-xs space-y-1 mt-3">
                    <div>💻 Internet Banking</div>
                    <div>📱 Mobile Banking</div>
                    <div>💳 Kartu Kredit/Debit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>�</span>
              <span>Pembayaran aman dan terpercaya dengan enkripsi tingkat bank</span>
            </div>
            <p className="text-xs text-gray-500">
              Transaksi diproses oleh Midtrans - Payment Gateway terpercaya di Indonesia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
