'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function PublicContactAndLocation() {
  const { settings, showToast } = useClinic();

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCategory, setContactCategory] = useState('Informasi Layanan');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) {
      showToast('Mohon lengkapi formulir pertanyaan Anda.');
      return;
    }

    setIsSubmitted(true);
    showToast('Pesan Anda telah diterima tim staf resepsionis.');

    // Auto reset after 4s
    setTimeout(() => {
      setContactName('');
      setContactPhone('');
      setContactMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  const handleOpenDirectWhatsApp = () => {
    const text = `Halo Admin Klinik Medika Sehat, saya ingin menanyakan perihal informasi klinik.`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="kontak" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            Kontak & Lokasi Klinik
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Kunjungi Kami atau Konsultasikan Kebutuhan Anda
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Terletak strategis di pusat kota dengan akses mudah, fasilitas parkir luas, dan unit gawat darurat yang siap melayani 24 jam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Operational Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Card */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal-100/60 text-teal-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Alamat Lengkap</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {settings.address}, {settings.city} {settings.postalCode}
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-semibold mt-2"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Contact numbers */}
              <div className="space-y-3 pt-4 border-t border-slate-200/80 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Telepon UGD (24 Jam):</span>
                  <a href={`tel:${settings.phoneEmergency.replace(/\D/g, '')}`} className="font-bold text-rose-700 font-mono">
                    {settings.phoneEmergency}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Telepon Resepsionis:</span>
                  <a href={`tel:${settings.phoneReception.replace(/\D/g, '')}`} className="font-semibold text-slate-800 font-mono">
                    {settings.phoneReception}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">WhatsApp Resmi CS:</span>
                  <button
                    onClick={handleOpenDirectWhatsApp}
                    className="text-teal-700 hover:underline font-bold font-mono cursor-pointer"
                  >
                    +{settings.whatsapp}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Korespondensi:</span>
                  <a href={`mailto:${settings.email}`} className="text-slate-800 hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Operational Hours */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal-100/60 text-teal-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Jam Operasional Pelayanan</h3>
                  <span className="text-xs text-slate-500">Jadwal buka loket pendaftaran</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                  <span className="text-slate-600">Poliklinik (Senin - Sabtu):</span>
                  <span className="font-semibold text-slate-900">08:00 - 21:00 WIB</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                  <span className="text-slate-600">Poliklinik (Minggu & Libur):</span>
                  <span className="font-semibold text-slate-900">08:00 - 16:00 WIB</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-rose-700 font-semibold">UGD, Laboratorium & Farmasi:</span>
                  <span className="font-bold text-rose-700">24 Jam Non-Stop</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Chat Card */}
            <div className="bg-teal-900 text-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Konsultasi Cepat</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Butuh Bantuan Segera?
              </h3>
              <p className="text-xs text-teal-100 leading-relaxed mb-4">
                Staf Customer Care kami siap membantu pengecekan jadwal dokter, ketersediaan obat, atau estimasi tarif via WhatsApp.
              </p>
              <button
                onClick={handleOpenDirectWhatsApp}
                className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi CS via WhatsApp</span>
              </button>
            </div>

          </div>

          {/* Right Column: Google Maps & Message Inquiry Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Google Maps Visual Box */}
            <div className="bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Peta Lokasi Klinik Medika Sehat (Menteng, Jakarta Pusat)</span>
                </span>
                <span className="text-[11px] text-slate-500">Koordinat: -6.175392, 106.828456</span>
              </div>
              
              {/* Map Canvas / Embed */}
              <div className="w-full h-64 sm:h-72 bg-slate-200 relative">
                <iframe
                  title="Google Maps Lokasi Klinik Medika Sehat"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6663273180293!2d106.828456!3d-6.175392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Kirim Pertanyaan / Pesan ke Resepsionis
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Pertanyaan umum, kerjasama asuransi kesehatan perusahaan, atau konfirmasi ketersediaan poli.
              </p>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Pesan Anda Berhasil Terkirim
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Terima kasih, <strong>{contactName}</strong>. Staf klinik kami akan segera membalas melalui WhatsApp di <strong>{contactPhone}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contoh: Budi Gunawan"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Pertanyaan
                    </label>
                    <select
                      value={contactCategory}
                      onChange={(e) => setContactCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    >
                      <option value="Informasi Layanan">Informasi Layanan & Poliklinik</option>
                      <option value="Jadwal Dokter">Konfirmasi Jadwal Dokter</option>
                      <option value="Pemeriksaan Lab / MCU">Medical Check Up & Laboratorium</option>
                      <option value="Asuransi & Pembayaran">Kerjasama Asuransi / Korporat</option>
                      <option value="Kritik & Saran">Kritik, Saran & Umpan Balik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pesan atau Pertanyaan Anda <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tuliskan pertanyaan atau kebutuhan konsultasi Anda secara jelas di sini..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan ke Klinik</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
