'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { ClinicFacility } from '@/types/clinic';
import { Plus, Edit3, Trash2, X, Building2, Check } from 'lucide-react';

export default function AdminFacilities() {
  const { facilities, addFacility, updateFacility, deleteFacility, currentUser, showToast } = useClinic();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fasilitas Diagnostik');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [specsStr, setSpecsStr] = useState('');

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setName('');
    setCategory('Fasilitas Diagnostik');
    setDescription('');
    setImageUrl('/images/facility_laboratory_1791085802125.jpg');
    setSpecsStr('Standar sterilisasi KARS, Ruangan berpendingin udara, Akses disabilitas');
  };

  const handleOpenEdit = (fac: ClinicFacility) => {
    setModalMode('edit');
    setEditingId(fac.id);
    setName(fac.name);
    setCategory(fac.category);
    setDescription(fac.description);
    setImageUrl(fac.imageUrl);
    setSpecsStr(fac.specifications.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = specsStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (modalMode === 'create') {
      addFacility({
        name,
        category,
        description,
        imageUrl: imageUrl || '/images/hero_clinic_reception_1791085787174.jpg',
        specifications: specs.length > 0 ? specs : ['Standar medis nasional'],
      });
    } else if (modalMode === 'edit' && editingId) {
      updateFacility(editingId, {
        name,
        category,
        description,
        imageUrl,
        specifications: specs,
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
            Manajemen Fasilitas Klinik & Penunjang
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola foto sarana prasarana, laboratorium diagnostik, dan standar ruang tindakan.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas Baru</span>
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-100">
                <Image
                  src={fac.imageUrl}
                  alt={fac.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {fac.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {fac.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {fac.description}
                </p>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="font-semibold text-slate-700 mb-1">Spesifikasi Fasilitas:</div>
                  {fac.specifications.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(fac)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                title="Edit Fasilitas"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus fasilitas "${fac.name}"?`)) {
                    deleteFacility(fac.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                title="Hapus Fasilitas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {modalMode === 'create' ? 'Tambah Fasilitas Klinik' : 'Edit Data Fasilitas'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Isi rincian fasilitas dan spesifikasi penunjang.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Fasilitas *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Laboratorium Patologi & Analisis Darah"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Fasilitas Diagnostik / Area Publik / Area Medis"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Gambar Fasilitas
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/facility_laboratory_1791085802125.jpg"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Lengkap *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Uraian manfaat dan keunggulan fasilitas..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spesifikasi Teknis (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={specsStr}
                  onChange={(e) => setSpecsStr(e.target.value)}
                  placeholder="Hematology analyzer otomatis, Buka 24 jam, Kalibrasi rutin KARS"
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
                  Simpan Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
