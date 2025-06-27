import { Smartphone, CreditCard, Building, Store } from 'lucide-react';
import { ReactElement } from 'react';

interface PaymentMethod {
  name: string;
  priority: number | null;
  color: string;
  featured?: boolean;
}

interface PaymentCategory {
  category: string;
  icon: ReactElement;
  methods: PaymentMethod[];
  description: string;
}

export default function PaymentMethods() {
  const paymentMethods: PaymentCategory[] = [
    {
      category: 'E-Wallet',
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      methods: [
        { name: 'GoPay', priority: 1, color: 'bg-green-500' },
        { name: 'ShopeePay', priority: 2, color: 'bg-orange-500' },
        { name: 'QRIS', priority: 3, color: 'bg-blue-500' }
      ],
      description: 'Bayar langsung dari aplikasi favorit Anda'
    },
    {
      category: 'Transfer Bank',
      icon: <Building className="w-6 h-6 text-blue-600" />,
      methods: [
        { name: 'Mandiri', priority: 4, color: 'bg-yellow-600', featured: true },
        { name: 'BCA', priority: null, color: 'bg-blue-600' },
        { name: 'BNI', priority: null, color: 'bg-orange-600' },
        { name: 'BRI', priority: null, color: 'bg-blue-800' }
      ],
      description: 'Virtual Account semua bank utama'
    },
    {
      category: 'Retail & Kartu',
      icon: <Store className="w-6 h-6 text-purple-600" />,
      methods: [
        { name: 'Indomaret', priority: null, color: 'bg-red-500' },
        { name: 'Alfamart', priority: null, color: 'bg-blue-600' },
        { name: 'Kartu Kredit', priority: null, color: 'bg-gray-700' }
      ],
      description: 'Bayar di minimarket atau dengan kartu'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Bayar dengan Mudah
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih metode pembayaran yang paling nyaman untuk Anda. Semua transaksi aman dan terpercaya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paymentMethods.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.category}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>

              <div className="space-y-3">
                {category.methods.map((method, methodIndex) => (
                  <div key={methodIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${method.color} rounded-lg flex items-center justify-center shadow-sm`}>
                        <span className="text-white text-xs font-bold">
                          {method.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {method.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                          Prioritas
                        </span>
                      )}
                      {method.priority && method.priority <= 3 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          #{method.priority}
                        </span>
                      )}
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                  </div>
                ))}
              </div>

              {categoryIndex === 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm font-medium text-center">
                    🚀 Pembayaran instan & otomatis
                  </p>
                </div>
              )}

              {categoryIndex === 1 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm font-medium text-center">
                    💳 Transfer 24/7 dari ATM/Mobile Banking
                  </p>
                </div>
              )}

              {categoryIndex === 2 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-purple-800 text-sm font-medium text-center">
                    🏪 Bayar tunai di lokasi terdekat
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-6 bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">Enkripsi SSL 256-bit</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm font-medium">Powered by Midtrans</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-purple-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-sm font-medium">Refund 100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
