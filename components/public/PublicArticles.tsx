'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { Article } from '@/types/clinic';
import { BookOpen, Search, Clock, User, X, Calendar, Share2, Check } from 'lucide-react';

export default function PublicArticles() {
  const { articles } = useClinic();
  const [searchArticle, setSearchArticle] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const publishedArticles = articles.filter((a) => a.status === 'Published');
  const categories = ['Semua', ...Array.from(new Set(publishedArticles.map((a) => a.category)))];

  const filteredArticles = publishedArticles.filter((a) => {
    const matchCat = selectedCat === 'Semua' || a.category === selectedCat;
    const matchSearch = a.title.toLowerCase().includes(searchArticle.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchArticle.toLowerCase()) ||
      a.doctorAuthor.toLowerCase().includes(searchArticle.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopyShare = (art: Article) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/#artikel-${art.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="artikel" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Edukasi & Info Kesehatan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Artikel Medis Terpercaya Ditinjau oleh Tim Dokter
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Informasi kesehatan preventif, panduan gizi medis, dan tips perawatan keluarga yang ditulis berdasarkan bukti ilmiah.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <label htmlFor="search-articles-input" className="sr-only">Cari artikel</label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-articles-input"
              type="text"
              value={searchArticle}
              onChange={(e) => setSearchArticle(e.target.value)}
              placeholder="Cari topik kesehatan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setActiveArticleModal(art)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={art.coverImageUrl}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {art.category}
                  </div>
                </div>

                <div className="p-5">
                  {/* Metadata line without pill wraps */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{art.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{art.readTimeMinutes} mnt baca</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-2 mb-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-2 pt-3 text-[11px] text-slate-600">
                  <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="truncate">Peninjau: <strong>{art.doctorAuthor}</strong></span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Reader Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Tutup artikel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Meta */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <span className="font-semibold text-teal-800">{activeArticleModal.category}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticleModal.publishedAt}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticleModal.readTimeMinutes} menit baca</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
              {activeArticleModal.title}
            </h2>

            {/* Doctor Reviewer Card */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                  MD
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Ditinjau oleh: {activeArticleModal.doctorAuthor}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {activeArticleModal.doctorTitle}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopyShare(activeArticleModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer"
                title="Salin tautan artikel"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
              </button>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-slate-100">
              <Image
                src={activeArticleModal.coverImageUrl}
                alt={activeArticleModal.title}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content Text */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4 mb-6">
              {activeArticleModal.content}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Topik Terkait:</span>
              {activeArticleModal.tags.map((tag) => (
                <span key={tag} className="text-slate-600">#{tag}</span>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticleModal(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Tutup Bacaan
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
