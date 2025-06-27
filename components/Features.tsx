import { Target, TrendingUp, Users, Zap, BookOpen, Award } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "Strategi Targeting yang Tepat",
    description: "Pelajari cara mengidentifikasi dan menargetkan audience yang tepat untuk bisnis Anda dengan precision tinggi."
  },
  {
    icon: TrendingUp,
    title: "Meningkatkan Konversi",
    description: "Teknik-teknik terbukti untuk meningkatkan conversion rate hingga 300% dengan optimasi yang tepat."
  },
  {
    icon: Users,
    title: "Social Media Mastery",
    description: "Kuasai semua platform social media dan bangun community yang engaged dengan brand Anda."
  },
  {
    icon: Zap,
    title: "Automation Tools",
    description: "Otomatisasi marketing processes untuk menghemat waktu dan meningkatkan efisiensi kerja."
  },
  {
    icon: BookOpen,
    title: "Case Studies Real",
    description: "Pelajari dari 20+ case studies nyata dari bisnis yang berhasil menerapkan strategi digital marketing."
  },
  {
    icon: Award,
    title: "Sertifikat Completion",
    description: "Dapatkan sertifikat digital setelah menyelesaikan seluruh materi dalam ebook ini."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa yang Akan Anda Pelajari?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ebook ini berisi strategi komprehensif yang telah terbukti membantu ribuan 
            pebisnis mencapai kesuksesan di era digital.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
