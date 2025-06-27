import { useState } from 'react';
import { Download, Mail, User, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface DownloadFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DownloadForm({ isVisible, onClose }: DownloadFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || session?.user?.name,
          email: formData.email || session?.user?.email,
          product_id: '1'
        }),
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage('Download berhasil! Link telah dikirim ke email Anda.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage(data.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Download Ebook Gratis
            </h3>
            <p className="text-gray-600">
              {session 
                ? `Halo ${session.user?.name}, download ebook secara instant!`
                : 'Masukkan data Anda untuk mendapatkan ebook secara instant'
              }
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('berhasil') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!session && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      placeholder="Masukkan nama lengkap Anda"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      placeholder="nama@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {session && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <img
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=10b981&color=fff`}
                    alt={session.user?.name || 'User'}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-1" />
            Data Anda aman dan tidak akan dishare ke pihak lain
          </div>
        </div>
      </div>
    </div>
  );
}
