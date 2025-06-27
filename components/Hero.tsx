import { useState } from 'react';
import { Download, Star, Users, BookOpen, TrendingUp, Target, Zap } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  onDownloadClick: () => void;
}

export default function Hero({ onDownloadClick }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-white via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="max-w-prose">
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">4.9/5 dari 1,234+ pembaca</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white leading-tight">
              Panduan Lengkap
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Digital Marketing
              </span>
              <br />
              untuk Bisnis Modern
            </h1>

            <p className="mt-6 text-lg text-gray-700 sm:text-xl dark:text-gray-200 leading-relaxed">
              Dapatkan ebook eksklusif berisi <strong>150+ halaman</strong> strategi digital marketing terpercaya 
              yang telah membantu ribuan bisnis meningkatkan penjualan hingga <strong className="text-emerald-600">300%</strong>. 
              Cocok untuk pemula hingga mahir.
            </p>

            {/* Key Benefits */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-emerald-100">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">ROI 300%+</p>
                  <p className="text-xs text-gray-600">Tingkatkan Revenue</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Target Akurat</p>
                  <p className="text-xs text-gray-600">Jangkau Audience</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Implementasi</p>
                  <p className="text-xs text-gray-600">Mudah & Cepat</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">15,000+ Downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">150+ Halaman</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">PDF Format</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onDownloadClick}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:scale-105 hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Gratis Sekarang
              </button>

              <a
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-8 py-4 font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:scale-105 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                href="#features"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">🔒 100% Gratis</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">Tanpa Spam</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">Instant Download</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 font-medium">Pembayaran Premium tersedia via:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Go</span>
                  </div>
                  <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">SP</span>
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">QR</span>
                  </div>
                  <div className="w-6 h-6 bg-yellow-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="text-xs text-gray-500">& 15+ lainnya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative lg:order-last">
            <div className="relative">
              {/* Main ebook mockup */}
              <div className="relative z-10 transform rotate-6 hover:rotate-3 transition-transform duration-300">
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="aspect-[3/4] bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Digital Marketing</h3>
                        <p className="text-emerald-100 text-sm">Panduan Lengkap</p>
                        <p className="text-emerald-100 text-sm">untuk Bisnis Modern</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1 bg-white bg-opacity-30 rounded"></div>
                        <div className="h-1 bg-white bg-opacity-30 rounded w-3/4"></div>
                        <div className="h-1 bg-white bg-opacity-30 rounded w-1/2"></div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-100">150+ Halaman</p>
                        <p className="text-lg font-bold">2024 Edition</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-yellow-100 rounded-full p-3 shadow-lg animate-bounce">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-blue-100 rounded-full p-3 shadow-lg animate-pulse">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>

              <div className="absolute top-1/2 -left-8 bg-emerald-100 rounded-full p-2 shadow-lg">
                <Download className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
