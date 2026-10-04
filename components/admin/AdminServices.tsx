'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { MedicalService, ServiceCategory } from '@/types/clinic';
import { formatRupiah } from '@/lib/storage';
import { Plus, Edit3, Trash2, X, Check, Search, ToggleLeft, ToggleRight, Stethoscope } from 'lucide-react';

export default function AdminServices() {
  const { 
    services, 
    addService, 
    updateService, 
    deleteService, 
    toggleServiceAvailability, 
    currentUser, 
    showToast 
  } = useClinic();

  const [searchService, setSearchService] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Poliklinik Umum');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('20 - 30 menit');
  const [priceMin, setPriceMin] = useState(100000);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [doctorInCharge, setDoctorInCharge] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [iconName, setIconName] = useState('Stethoscope');

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchService.toLowerCase()) ||
    s.category.toLowerCase().includes(searchService.toLowerCase())
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setName('');
    setCategory('Poliklinik Umum');
    setDescription('');
    setEstimatedDuration('15 - 30 menit');
    setPriceMin(100000);
    setPriceMax(undefined);
    setDoctorInCharge('dr. Tim Dokter');
    setFeaturesStr('Pemeriksaan fisik lengkap, Resep obat, Konseling');
    setIconName('Stethoscope');
  };

  const handleOpenEdit = (srv: MedicalService) => {
    setModalMode('edit');
    setEditingId(srv.id);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setEstimatedDuration(srv.estimatedDuration);
    setPriceMin(srv.priceMin);
    setPriceMax(srv.priceMax);
    setDoctorInCharge(srv.doctorInCharge);
    setFeaturesStr(srv.features.join(', '));
    setIconName(srv.iconName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feats = featuresStr.split(',').map((f) => f.trim()).filter(Boolean);

    if (modalMode === 'create') {
      addService({
        name,
        category,
        description,
        estimatedDuration,
        priceMin: Number(priceMin),
        priceMax: priceMax ? Number(priceMax) : undefined,
        doctorInCharge,
        iconName,
        isAvailable: true,
        features: feats.length > 0 ? feats : ['Pemeriksaan standar medis'],
      });
    } else if (modalMode === 'edit' && editingId) {
      updateService(editingId, {
        name,
        category,
        description,
        estimatedDuration,
        priceMin: Number(priceMin),
        priceMax: priceMax ? Number(priceMax) : undefined,
        doctorInCharge,
        iconName,
        features: feats,
      });
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Katalog Layanan Medis & Estimasi Tarif
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh poliklinik, layanan diagnostik, estimasi biaya, dan penanggung jawab medis.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
          placeholder="Cari nama poli atau kategori..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
        />
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Layanan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Estimasi Tarif</th>
                <th className="py-3 px-4">Durasi & PJ Medis</th>
                <th className="py-3 px-4">Status Tampil</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{srv.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{srv.description}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {srv.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">{formatRupiah(srv.priceMin)}</div>
                    {srv.priceMax && <div className="text-[10px] text-slate-400">s/d {formatRupiah(srv.priceMax)}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800">{srv.estimatedDuration}</div>
                    <div className="text-[11px] text-slate-400">{srv.doctorInCharge}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleServiceAvailability(srv.id)}
                      className="inline-flex items-center gap-1 text-xs cursor-pointer"
                      title="Klik untuk ubah ketersediaan di web publik"
                    >
                      {srv.isAvailable ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                          <span>Non-aktif</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                        title="Edit Layanan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus layanan "${srv.name}"?`)) {
                            deleteService(srv.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Hapus Layanan"
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

      {/* CRUD Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {modalMode === 'create' ? 'Tambah Layanan Medis Baru' : 'Edit Layanan Medis'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Isi parameter deskripsi, estimasi biaya, dan penanggung jawab layanan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Layanan Medis *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Poliklinik Gigi & Konservasi Mulut"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Layanan *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Poliklinik Umum">Poliklinik Umum</option>
                    <option value="Dokter Spesialis">Dokter Spesialis</option>
                    <option value="Diagnostik & Lab">Diagnostik & Lab</option>
                    <option value="Layanan Khusus">Layanan Khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimasi Durasi
                  </label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="20 - 30 menit"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Dasar Min (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    step={5000}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Maks (Opsional)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={priceMax || ''}
                    onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Kosongkan bila tunggal"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dokter / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={doctorInCharge}
                  onChange={(e) => setDoctorInCharge(e.target.value)}
                  placeholder="dr. Spesialis / Apoteker"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Lengkap Layanan *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan cakupan pemeriksaan medis..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fitur / Keunggulan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  placeholder="Pemeriksaan vital sign, Resep digital, Surat sehat"
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
                  {modalMode === 'create' ? 'Simpan Layanan' : 'Perbarui Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
