'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { Doctor } from '@/types/clinic';
import { formatRupiah } from '@/lib/storage';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Clock, 
  UserRoundCheck,
  Search
} from 'lucide-react';

export default function AdminDoctors() {
  const { 
    doctors, 
    addDoctor, 
    updateDoctor, 
    deleteDoctor, 
    toggleDoctorLeave, 
    currentUser, 
    showToast 
  } = useClinic();

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  const [searchDoctor, setSearchDoctor] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState('Penyakit Dalam');
  const [sip, setSip] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [consultationFee, setConsultationFee] = useState(150000);
  const [daysActiveStr, setDaysActiveStr] = useState('Senin, Rabu, Jumat');
  const [hoursText, setHoursText] = useState('09:00 - 14:00 WIB');
  const [quotaPerDay, setQuotaPerDay] = useState(20);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingDocId(null);
    setName('');
    setTitle('Spesialis ...');
    setSpecialization('Penyakit Dalam');
    setSip('446/SIP/Sp.PD/DKI/2024');
    setExperienceYears(8);
    setEducation('Fakultas Kedokteran Universitas Indonesia');
    setBio('Spesialis berpengalaman dalam bidang...');
    setAvatarUrl('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80');
    setConsultationFee(200000);
    setDaysActiveStr('Senin, Rabu, Jumat');
    setHoursText('09:00 - 13:00 WIB');
    setQuotaPerDay(20);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setModalMode('edit');
    setEditingDocId(doc.id);
    setName(doc.name);
    setTitle(doc.title);
    setSpecialization(doc.specialization);
    setSip(doc.sip);
    setExperienceYears(doc.experienceYears);
    setEducation(doc.education);
    setBio(doc.bio);
    setAvatarUrl(doc.avatarUrl);
    setConsultationFee(doc.consultationFee);
    setDaysActiveStr(doc.daysActive.join(', '));
    setHoursText(doc.hoursText);
    setQuotaPerDay(doc.quotaPerDay);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Perubahan data dokter memerlukan hak akses Super Admin.');
      return;
    }

    const days = daysActiveStr
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30'];

    if (modalMode === 'create') {
      addDoctor({
        name,
        title,
        specialization,
        sip,
        experienceYears: Number(experienceYears),
        education,
        bio,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
        consultationFee: Number(consultationFee),
        daysActive: days.length > 0 ? days : ['Senin', 'Rabu'],
        hoursText,
        timeSlots,
        quotaPerDay: Number(quotaPerDay),
        isLeave: false,
      });
    } else if (modalMode === 'edit' && editingDocId) {
      updateDoctor(editingDocId, {
        name,
        title,
        specialization,
        sip,
        experienceYears: Number(experienceYears),
        education,
        bio,
        avatarUrl,
        consultationFee: Number(consultationFee),
        daysActive: days,
        hoursText,
        quotaPerDay: Number(quotaPerDay),
      });
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Create */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Manajemen Dokter & Jadwal Praktik
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar dokter spesialis, surat izin praktik (SIP), jadwal hari & status cuti aktif.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Dokter Baru</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
          placeholder="Cari nama atau spesialisasi dokter..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
        />
      </div>

      {/* Doctors Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              {/* Doctor Head */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                  <Image
                    src={doc.avatarUrl}
                    alt={doc.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {doc.name}
                  </h3>
                  <div className="text-xs text-teal-700 font-medium truncate">
                    {doc.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    SIP: {doc.sip}
                  </div>
                </div>
              </div>

              {/* Status & Cuti Toggle */}
              <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 text-xs mb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status Praktik:</span>
                  {doc.isLeave ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Sedang Cuti</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Praktik Aktif</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{doc.daysActive.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{doc.hoursText}</span>
                </div>
              </div>

              {/* Biaya & Kuota */}
              <div className="flex items-center justify-between text-xs py-1 text-slate-600">
                <span>Tarif Konsultasi:</span>
                <span className="font-bold text-slate-900 tabular-nums font-mono">
                  {formatRupiah(doc.consultationFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 text-slate-600">
                <span>Kuota Pasien / Hari:</span>
                <span className="font-mono text-slate-800">{doc.quotaPerDay} pasien</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
              {isSuperAdmin && (
                <button
                  onClick={() => toggleDoctorLeave(doc.id)}
                  className={`text-xs px-2.5 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    doc.isLeave
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  {doc.isLeave ? 'Aktifkan Kembali' : 'Tandai Cuti'}
                </button>
              )}

              <div className="flex items-center gap-1 ml-auto">
                {isSuperAdmin && (
                  <>
                    <button
                      onClick={() => handleOpenEdit(doc)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                      title="Edit Data Dokter"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus dokter ${doc.name}?`)) {
                          deleteDoctor(doc.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Hapus Dokter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        ))}
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
              {modalMode === 'create' ? 'Tambah Data Dokter Baru' : 'Edit Profil Dokter'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Lengkapi data profil medis dan jadwal praktik dokter.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: dr. Adrian Wicaksono, Sp.PD"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gelar Spesialisasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Spesialis Penyakit Dalam"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Poliklinik
                  </label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Contoh: Penyakit Dalam"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor SIP *
                  </label>
                  <input
                    type="text"
                    required
                    value={sip}
                    onChange={(e) => setSip(e.target.value)}
                    placeholder="446/SIP/Sp.PD/DKI/2020"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pengalaman (Tahun)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Riwayat Pendidikan & Almamater
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="FK Universitas Indonesia"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biografi Singkat / Fokus Klinis
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Fokus penanganan penyakit..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hari Praktik (Pisahkan koma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={daysActiveStr}
                    onChange={(e) => setDaysActiveStr(e.target.value)}
                    placeholder="Senin, Rabu, Jumat"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Shift Praktik *
                  </label>
                  <input
                    type="text"
                    required
                    value={hoursText}
                    onChange={(e) => setHoursText(e.target.value)}
                    placeholder="09:00 - 14:00 WIB"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Konsultasi (Rp) *
                  </label>
                  <input
                    type="number"
                    step={10000}
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kuota Pasien / Hari
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={quotaPerDay}
                    onChange={(e) => setQuotaPerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
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
                  {modalMode === 'create' ? 'Simpan Dokter Baru' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
