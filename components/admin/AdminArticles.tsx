'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { Article } from '@/types/clinic';
import { Plus, Edit3, Trash2, X, FileText, ToggleLeft, ToggleRight, Calendar, User, Eye } from 'lucide-react';

export default function AdminArticles() {
  const { 
    articles, 
    addArticle, 
    updateArticle, 
    deleteArticle, 
    toggleArticleStatus, 
    doctors,
    showToast 
  } = useClinic();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Penyakit Dalam');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [doctorAuthor, setDoctorAuthor] = useState(doctors[0]?.name || 'dr. Adrian Wicaksono, Sp.PD');
  const [doctorTitle, setDoctorTitle] = useState('Spesialis Penyakit Dalam');
  const [readTimeMinutes, setReadTimeMinutes] = useState(4);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('Kesehatan, Tips Medis');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setTitle('');
    setCategory('Penyakit Dalam');
    setExcerpt('');
    setContent('');
    setDoctorAuthor(doctors[0]?.name || 'dr. Adrian Wicaksono, Sp.PD');
    setDoctorTitle(doctors[0]?.title || 'Spesialis Penyakit Dalam');
    setReadTimeMinutes(4);
    setCoverImageUrl('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80');
    setTagsStr('Kesehatan, Edukasi Medis');
    setStatus('Published');
  };

  const handleOpenEdit = (art: Article) => {
    setModalMode('edit');
    setEditingId(art.id);
    setTitle(art.title);
    setCategory(art.category);
    setExcerpt(art.excerpt);
    setContent(art.content);
    setDoctorAuthor(art.doctorAuthor);
    setDoctorTitle(art.doctorTitle);
    setReadTimeMinutes(art.readTimeMinutes);
    setCoverImageUrl(art.coverImageUrl);
    setTagsStr(art.tags.join(', '));
    setStatus(art.status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (modalMode === 'create') {
      addArticle({
        slug,
        title,
        category,
        excerpt,
        content,
        doctorAuthor,
        doctorTitle,
        readTimeMinutes: Number(readTimeMinutes),
        publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
        tags: tags.length > 0 ? tags : ['Kesehatan'],
        status,
      });
    } else if (modalMode === 'edit' && editingId) {
      updateArticle(editingId, {
        slug,
        title,
        category,
        excerpt,
        content,
        doctorAuthor,
        doctorTitle,
        readTimeMinutes: Number(readTimeMinutes),
        coverImageUrl,
        tags,
        status,
      });
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Manajemen Artikel & Edukasi Pasien (Blog CMS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publikasikan tips kesehatan medis, artikel pencegahan penyakit, dan tinjauan dokter.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Artikel Baru</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Judul Artikel</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Dokter Peninjau</th>
                <th className="py-3 px-4">Tanggal Rilis</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{art.excerpt}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {art.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{art.doctorAuthor}</div>
                    <div className="text-[11px] text-slate-400">{art.readTimeMinutes} menit baca</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {art.publishedAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleArticleStatus(art.id)}
                      className="inline-flex items-center gap-1 text-xs cursor-pointer"
                      title="Klik untuk ubah status Published / Draft"
                    >
                      {art.status === 'Published' ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5 text-amber-500" />
                          <span>Draft</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                        title="Edit Artikel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus artikel "${art.title}"?`)) {
                            deleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {modalMode === 'create' ? 'Tulis Artikel Edukasi Kesehatan' : 'Sunting Artikel Medis'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Lengkapi judul, dokter reviewer, ringkasan, dan isi naskah artikel.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Artikel Kesehatan *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: 5 Langkah Mencegah Komplikasi Hipertensi di Usia Produktif"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Artikel *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Penyakit Dalam / Ibu & Anak / Gigi / Umum"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimasi Waktu Baca (Menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dokter Peninjau (Reviewer) *
                  </label>
                  <select
                    value={doctorAuthor}
                    onChange={(e) => {
                      setDoctorAuthor(e.target.value);
                      const d = doctors.find((doc) => doc.name === e.target.value);
                      if (d) setDoctorTitle(d.title);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>{d.name} ({d.title})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Published">Published (Tayang di Publik)</option>
                    <option value="Draft">Draft (Disimpan Sementara)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Cover Gambar
                </label>
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ringkasan Singkat (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu pratinjau..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              {/* Rich Content Editor Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konten Naskah Lengkap (WYSIWYG Prose) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan naskah edukasi kesehatan di sini dengan paragraf yang terstruktur..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag Topik (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Hipertensi, Gula Darah, Gizi Sehat, Jantung"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Simpan & Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
