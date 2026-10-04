'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { ShieldCheck, Award, Users, Star, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function PublicStatsAndAccreditation() {
  const { settings } = useClinic();

  const metrics = [
    {
      value: '35.000+',
      label: 'Pasien Terlayani',
      subtext: 'Kunjungan rawat jalan & MCU tahun 2025-2026',
    },
    {
      value: '28',
      label: 'Dokter & Tenaga Medis',
      subtext: 'Spesialis bersertifikat kolegium medis nasional',
    },
    {
      value: '99.4%',
      label: 'Indeks Kepuasan Pasien',
      subtext: 'Berdasarkan survei mutu Kemenkes RI',
    },
    {
      value: '24/7',
      label: 'Layanan IGD & Farmasi',
      subtext: 'Siaga gawat darurat tanpa hari libur',
    },
  ];

  const testimonials = [
    {
      quote:
        'Sistem booking online sangat rapi. Datang sesuai jam jadwal, tidak perlu antre berjam-jam. Dokter spesialis anak sangat telaten dan edukatif menjelaskan imunisasi bayi saya.',
      patientName: 'Kurnia Ramadhani',
      role: 'Ibu Rumah Tangga (Ibu dari Balita 8 Bulan)',
      city: 'Menteng, Jakarta Pusat',
      rating: 5,
    },
    {
      quote:
        'Pemeriksaan diabetes rutin dengan dr. Adrian Sp.PD sangat memuaskan. Hasil tes lab HbA1c keluar dalam 45 menit dan langsung dikirim ke WhatsApp saya. Penanganannya cepat dan profesional.',
      patientName: 'Ir. Hendro Wicaksono',
      role: 'Pasien Rawat Jalan Penyakit Dalam',
      city: 'Jakarta Selatan',
      rating: 5,
    },
    {
      quote:
        'Klinik sangat bersih, peralatan gigi modern, dan staf resepsionisnya ramah. Penambalan gigi tidak terasa sakit sama sekali. Tarifnya juga sangat transparan dan jelas di awal.',
      patientName: 'Sabrina Maharani',
      role: 'Karyawan Swasta',
      city: 'Jakarta Pusat',
      rating: 5,
    },
  ];

  return (
    <section id="tentang" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Quantitative Proof Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 tabular-nums mb-1 font-mono">
                {m.value}
              </div>
              <div className="text-sm font-semibold text-teal-800 mb-1">
                {m.label}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {m.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* About Clinic: Visi, Misi & Sertifikasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Profil & Akreditasi Resmi</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              Dedikasi Pelayanan Medis Humanis dengan Mutu Terstandarisasi
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Didirikan sebagai wujud komitmen menghadirkan layanan kesehatan primer dan spesialistik yang komprehensif, <strong>{settings.clinicName}</strong> mengintegrasikan kemahiran tenaga medis profesional, fasilitas diagnostik terkini, serta sistem pelayanan digital yang menghargai waktu pasien.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Visi Kami</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Menjadi jaringan klinik kesehatan pilihan utama keluarga yang unggul dalam ketepatan diagnosis, kenyamanan fasilitas, dan keterjangkauan tarif.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Misi Pelayanan</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Menerapkan protokol pencegahan infeksi ketat, mengutamakan keselamatan pasien (patient safety), serta menyediakan transparansi informasi rekam medis dan estimasi biaya di setiap sesi pengobatan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Sertifikasi & Akreditasi Mutu
                  </h3>
                  <p className="text-xs text-slate-500">
                    {settings.skKemenkes}
                  </p>
                </div>
              </div>

              <div className="py-6 space-y-4 text-sm text-slate-700">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Tingkat Akreditasi:</span>
                  <span className="font-semibold text-teal-800">Paripurna (Tingkat Tertinggi)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Lembaga Akreditasi:</span>
                  <span className="font-semibold text-slate-800">KARS / Kemenkes RI</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Sertifikasi Manajemen:</span>
                  <span className="font-semibold text-slate-800">ISO 9001:2015 Healthcare</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Izin Operasional:</span>
                  <span className="font-semibold text-slate-800 font-mono text-xs">SIPK-DKI/09/2024</span>
                </div>
              </div>

              <div className="bg-teal-50/70 p-4 rounded-lg flex items-center gap-3 text-xs text-teal-900">
                <HeartHandshake className="w-5 h-5 text-teal-700 shrink-0" />
                <span>Seluruh dokter dan paramedis kami memegang Surat Tanda Registrasi (STR) aktif dan Surat Izin Praktik (SIP) resmi Dinkes DKI Jakarta.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Claim-to-Proof Adjacency: Patient Testimonials */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
              Suara Pasien
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Kepercayaan & Pengalaman Nyata Pasien Kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4" aria-label={`${t.rating} dari 5 bintang`}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="font-semibold text-sm text-slate-900">
                    {t.patientName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t.role}
                  </div>
                  <div className="text-[11px] text-teal-800 mt-0.5">
                    {t.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
