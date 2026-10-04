'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Save, SlidersHorizontal, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings, currentUser, resetAllData, showToast } = useClinic();
  const isSuperAdmin = currentUser?.role === 'Super Admin';

  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [clinicTagline, setClinicTagline] = useState(settings.clinicTagline);
  const [skKemenkes, setSkKemenkes] = useState(settings.skKemenkes);
  const [accreditationText, setAccreditationText] = useState(settings.accreditationText);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [postalCode, setPostalCode] = useState(settings.postalCode);
  const [phoneEmergency, setPhoneEmergency] = useState(settings.phoneEmergency);
  const [phoneReception, setPhoneReception] = useState(settings.phoneReception);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [heroHeadline, setHeroHeadline] = useState(settings.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(settings.heroSubheadline);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Akses ditolak: Pengaturan umum klinik hanya dapat diubah oleh Super Admin.');
      return;
    }

    updateSettings({
      clinicName,
      clinicTagline,
      skKemenkes,
      accreditationText,
      address,
      city,
      postalCode,
      phoneEmergency,
      phoneReception,
      whatsapp,
      email,
      heroHeadline,
      heroSubheadline,
      announcementText,
      announcementActive,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Pengaturan Umum Klinik & Tampilan Web
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola nama instansi, nomor darurat UGD, alamat, teks banner utama, dan pengumuman berjalan.
          </p>
        </div>

        {!isSuperAdmin && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Mode Baca Saja (Khusus Super Admin)</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Identity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Identitas & Perizinan Klinik
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Resmi Klinik
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Moto Pelayanan
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={clinicTagline}
                onChange={(e) => setClinicTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Surat Keputusan Kemenkes RI
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={skKemenkes}
                onChange={(e) => setSkKemenkes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Akreditasi Resmi
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={accreditationText}
                onChange={(e) => setAccreditationText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Hero Section & Announcement Management (PRD requirement) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Manajemen Konten Banner Utama & Running Text
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headline Banner Utama (Hero Title)
            </label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subheadline Banner Utama
            </label>
            <textarea
              rows={2}
              disabled={!isSuperAdmin}
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none disabled:opacity-60"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Pemberitahuan Khusus / Running Announcement
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!isSuperAdmin}
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-700"
                />
                <span>Tampilkan di Bar Paling Atas</span>
              </label>
            </div>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Teks pengumuman yang berjalan di bagian atas website..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Contact & Location Settings */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Kontak & Jam Pelayanan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telepon UGD (24 Jam)
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={phoneEmergency}
                onChange={(e) => setPhoneEmergency(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telepon Resepsionis
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={phoneReception}
                onChange={(e) => setPhoneReception(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Customer Service
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Korespondensi
              </label>
              <input
                type="email"
                disabled={!isSuperAdmin}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kota & Provinsi
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSuperAdmin ? (
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Seluruh Pengaturan</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500 italic">
              Pengaturan terkunci pada role Content Editor.
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan semua data klinik ke default awal?')) {
                resetAllData();
              }
            }}
            className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Aplikasi ke Bawaan</span>
          </button>
        </div>

      </form>

    </div>
  );
}
