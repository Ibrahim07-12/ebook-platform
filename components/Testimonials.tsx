import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Indonesia",
    image: "https://images.unsplash.com/photo-1494790108755-2616b381e3a2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Ebook ini benar-benar game changer untuk bisnis saya! Revenue meningkat 250% dalam 3 bulan setelah menerapkan strateginya."
  },
  {
    name: "Ahmad Rizki",
    role: "Digital Marketing Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Panduan yang sangat lengkap dan mudah dipahami. Cocok banget untuk pemula yang ingin serius terjun ke digital marketing."
  },
  {
    name: "Lisa Chen",
    role: "E-commerce Owner",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Strategi yang dijelaskan sangat praktis dan actionable. Conversion rate toko online saya naik drastis setelah mengikuti tips ini."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka yang Sudah Membaca?
          </h2>
          <p className="text-xl text-gray-600">
            Ribuan pembaca telah merasakan manfaatnya langsung
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-200" />
              
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 italic leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
