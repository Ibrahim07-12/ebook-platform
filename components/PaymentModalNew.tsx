import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: number;
    name: string;
    price: number;
    original_price: number;
  };
  onPayment: (categoryId: number, paymentMethod: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  category,
  onPayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = [
    {
      id: 'gopay',
      name: 'GoPay',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" 
          alt="GoPay" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007E5C'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='10' font-weight='bold'%3EGP%3C/text%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Bayar dengan GoPay',
      color: 'bg-green-50 border-green-200 hover:border-green-300'
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" 
          alt="ShopeePay" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EE4D2D'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='8' font-weight='bold'%3ESP%3C/text%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Bayar dengan ShopeePay',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300'
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/QRIS_logo.svg" 
          alt="QRIS" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6900'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' fill='%23FF6900'/%3E%3Crect x='5' y='5' width='6' height='6' fill='white'/%3E%3Crect x='13' y='5' width='6' height='6' fill='white'/%3E%3Crect x='5' y='13' width='6' height='6' fill='white'/%3E%3Crect x='15' y='15' width='2' height='2' fill='white'/%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Scan QR Code untuk bayar',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      id: 'bca_va',
      name: 'BCA Virtual Account',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" 
          alt="BCA" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230066CC'%3E%3Crect width='24' height='24' rx='4' fill='%230066CC'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='8' font-weight='bold'%3EBCA%3C/text%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Virtual Account BCA',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      id: 'mandiri_va',
      name: 'Mandiri Virtual Account',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
          alt="Mandiri" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003d82'%3E%3Crect width='24' height='24' rx='4' fill='%23003d82'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='6' font-weight='bold'%3EMANDIRI%3C/text%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Virtual Account Mandiri',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      id: 'bni_va',
      name: 'BNI Virtual Account',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/55/BNI_logo.svg" 
          alt="BNI" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff8500'%3E%3Crect width='24' height='24' rx='4' fill='%23ff8500'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='8' font-weight='bold'%3EBNI%3C/text%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Virtual Account BNI',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300'
    },
    {
      id: 'bri_va',
      name: 'BRI Virtual Account',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg" 
          alt="BRI" 
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003d82'%3E%3Crect width='24' height='24' rx='4' fill='%23003d82'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='8' font-weight='bold'%3EBRI%3C/text%3E%3C/svg%3E";
          }}
        />
      ),
      description: 'Virtual Account BRI',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      id: 'permata_va',
      name: 'Permata Virtual Account',
      icon: (
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">PB</span>
        </div>
      ),
      description: 'Virtual Account Permata',
      color: 'bg-red-50 border-red-200 hover:border-red-300'
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit/Debit',
      icon: (
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
          <span className="text-white text-xs">💳</span>
        </div>
      ),
      description: 'Visa, Mastercard, JCB',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    }
  ];

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) {
      console.log('Invalid price:', price);
      return 'Rp 0';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    try {
      await onPayment(category.id, selectedMethod);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const discountPercentage = category.original_price > 0 && category.price > 0 
    ? Math.round(((category.original_price - category.price) / category.original_price) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-xl font-bold text-gray-900">Pilih Metode Pembayaran</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Category Info */}
        <div className="p-6 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(category.price)}
            </span>
            {category.original_price > category.price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(category.original_price)}
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                  Hemat {discountPercentage}%
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Akses 100+ ebook premium selamanya
          </p>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : `border-gray-200 ${method.color}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedMethod && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : selectedMethod ? (
              `Bayar ${formatPrice(category.price)}`
            ) : (
              'Pilih metode pembayaran'
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Pembayaran aman dan terenkripsi
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
