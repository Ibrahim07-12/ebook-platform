import { useState, useEffect } from 'react';
import { BookOpen, Users, Star, TrendingUp, Shield, Zap } from 'lucide-react';

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

interface CategoriesProps {
  onCategoryPurchase: (category: Category) => void;
}

const iconMap: { [key: string]: any } = {
  TrendingUp,
  BookOpen,
  Users,
  Star,
  Shield,
  Zap
};

// Default icon dan color untuk setiap kategori berdasarkan nama
const getDefaultIcon = (categoryName: string) => {
  if (categoryName.toLowerCase().includes('bisnis')) return 'TrendingUp';
  if (categoryName.toLowerCase().includes('marketing')) return 'Star';
  if (categoryName.toLowerCase().includes('kesehatan')) return 'Shield';
  if (categoryName.toLowerCase().includes('keuangan')) return 'TrendingUp';
  if (categoryName.toLowerCase().includes('kreatif')) return 'Zap';
  if (categoryName.toLowerCase().includes('pendidikan')) return 'BookOpen';
  if (categoryName.toLowerCase().includes('teknologi')) return 'Users';
  return 'BookOpen';
};

const getDefaultColor = (categoryName: string) => {
  if (categoryName.toLowerCase().includes('bisnis')) return '#10b981';
  if (categoryName.toLowerCase().includes('marketing')) return '#3b82f6';
  if (categoryName.toLowerCase().includes('kesehatan')) return '#ef4444';
  if (categoryName.toLowerCase().includes('keuangan')) return '#f59e0b';
  if (categoryName.toLowerCase().includes('kreatif')) return '#8b5cf6';
  if (categoryName.toLowerCase().includes('pendidikan')) return '#06b6d4';
  if (categoryName.toLowerCase().includes('teknologi')) return '#6366f1';
  return '#6b7280';
};

const formatPrice = (price: number) => {
  // Pastikan price adalah number yang valid
  const numPrice = Number(price);
  console.log('formatPrice called with:', price, 'converted to:', numPrice);
  if (isNaN(numPrice)) {
    console.log('Price is NaN, returning Rp 0');
    return 'Rp 0';
  }
  
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
  console.log('Formatted result:', formatted);
  return formatted;
};

export default function Categories({ onCategoryPurchase }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Jelajahi Kategori Ebook
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan ribuan ebook berkualitas tinggi dari berbagai kategori sesuai minat dan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const iconName = getDefaultIcon(category.name);
            const IconComponent = iconMap[iconName] || BookOpen;
            const categoryColor = getDefaultColor(category.name);
            
            return (
              <div
                key={category.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color: categoryColor }}
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold" style={{ color: categoryColor }}>
                      {formatPrice(category.price)}
                    </span>
                    {category.original_price > category.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(category.original_price)}
                      </span>
                    )}
                  </div>
                  {category.original_price > category.price && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium mt-1">
                      Hemat {Math.round(((category.original_price - category.price) / category.original_price) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      100+ ebook premium
                    </span>
                  </div>
                  
                  {category.avg_rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">
                        {category.avg_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onCategoryPurchase(category)}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: category.color,
                    boxShadow: `0 4px 14px 0 ${category.color}30`
                  }}
                >
                  Beli Sekarang
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Total Ebooks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">7</div>
              <div className="text-sm text-gray-600">Kategori</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">15K+</div>
              <div className="text-sm text-gray-600">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">4.8</div>
              <div className="text-sm text-gray-600">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
