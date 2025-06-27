import React, { useState } from 'react';
import { X, Copy, Upload, CheckCircle, Clock } from 'lucide-react';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: number;
    name: string;
    price: number;
    original_price: number;
  };
  onPaymentProof: (categoryId: number, proofFile: File, paymentMethod: string) => void;
}

const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  isOpen,
  onClose,
  category,
  onPaymentProof
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState<string>('');

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethods = [
    {
      id: 'gopay',
      name: 'GoPay',
      icon: '💚',
      info: 'Transfer ke nomor GoPay',
      account: process.env.NEXT_PUBLIC_GOPAY_NUMBER || '081234567890',
      accountName: 'EbookHub Indonesia'
    },
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: '🏦',
      info: 'Transfer ke rekening bank',
      account: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '1234567890',
      accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'EbookHub Indonesia',
      bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'BCA'
    },
    {
      id: 'dana',
      name: 'DANA',
      icon: '💙',
      info: 'Transfer ke nomor DANA',
      account: process.env.NEXT_PUBLIC_DANA_NUMBER || '081234567890',
      accountName: 'EbookHub Indonesia'
    },
    {
      id: 'ovo',
      name: 'OVO',
      icon: '💜',
      info: 'Transfer ke nomor OVO',
      account: process.env.NEXT_PUBLIC_OVO_NUMBER || '081234567890',
      accountName: 'EbookHub Indonesia'
    }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedMethod || !proofFile) return;

    setIsUploading(true);
    try {
      await onPaymentProof(category.id, proofFile, selectedMethod);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const discountPercentage = Math.round(((category.original_price - category.price) / category.original_price) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Pembayaran Manual</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Info */}
        <div className="p-6 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(category.price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(category.original_price)}
            </span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
              Hemat {discountPercentage}%
            </span>
          </div>
        </div>

        {/* Step 1: Choose Payment Method */}
        {!selectedMethod && (
          <div className="p-6">
            <h5 className="font-medium text-gray-900 mb-4">Pilih Metode Pembayaran:</h5>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.info}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Payment Instructions */}
        {selectedMethod && !proofFile && selectedPaymentMethod && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setSelectedMethod('')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Ganti metode
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-blue-900 mb-3">
                Transfer {formatPrice(category.price)} ke:
              </h5>
              
              <div className="space-y-3">
                {selectedPaymentMethod.bankName && (
                  <div>
                    <div className="text-sm text-blue-700">Bank:</div>
                    <div className="font-mono font-bold text-blue-900">
                      {selectedPaymentMethod.bankName}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-blue-700">
                    {selectedPaymentMethod.id === 'bank_transfer' ? 'Nomor Rekening:' : 'Nomor:'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900">
                      {selectedPaymentMethod.account}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedPaymentMethod.account, 'account')}
                      className="p-1 hover:bg-blue-200 rounded"
                    >
                      {copied === 'account' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700">Atas Nama:</div>
                  <div className="font-bold text-blue-900">
                    {selectedPaymentMethod.accountName}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700">Jumlah Transfer:</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900 text-lg">
                      {formatPrice(category.price)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(category.price.toString(), 'amount')}
                      className="p-1 hover:bg-blue-200 rounded"
                    >
                      {copied === 'amount' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Langkah Selanjutnya:</div>
                  <ol className="text-sm text-yellow-700 mt-1 list-decimal list-inside space-y-1">
                    <li>Transfer sesuai nominal exact</li>
                    <li>Screenshot bukti transfer</li>
                    <li>Upload bukti di bawah ini</li>
                    <li>Tunggu verifikasi (max 1 jam)</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Upload Bukti Transfer
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG max 5MB</p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {proofFile && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setProofFile(null)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Upload ulang
              </button>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Bukti transfer berhasil dipilih
                </span>
              </div>
              <div className="text-sm text-green-700 mt-1">
                File: {proofFile.name}
              </div>
            </div>

            <button
              onClick={handleSubmitProof}
              disabled={isUploading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400"
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengirim...
                </div>
              ) : (
                'Kirim Bukti Transfer'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Setelah verifikasi berhasil, Google Drive link akan dikirim ke email Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualPaymentModal;
