'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { Calendar, Stethoscope, Search, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';

interface PublicHeroProps {
  onSearchDoctors: (searchName: string, specialization: string, day: string) => void;
}

export default function PublicHero({ onSearchDoctors }: PublicHeroProps) {
  const { settings, doctors, openBookingModal } = useClinic();

  const [searchName, setSearchName] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Extract unique specializations
  const specializations = Array.from(new Set(doctors.map((d) => d.specialization)));
  const days = ['Semina / Hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchDoctors(searchName, selectedSpec, selectedDay === 'Semina / Hari' ? '' : selectedDay);
    const element = document.getElementById('dokter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="beranda" className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full bg-slate-950">
          <Image
            src="/images/hero_clinic_reception_1791085787174.jpg"
            alt="Lobi dan Ruang Pelayanan Klinik Medika Sehat"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 brightness-90"
            referrerPolicy="no-referrer"
          />
          {/* Gradients ensuring 4.5:1 contrast ratio across all screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl">
          {/* Institutional Trust Kicker (Strictly Unboxed Text) */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-400 uppercase mb-4">
            <Award className="w-4 h-4" />
            <span>Kemenkes RI Terakreditasi Paripurna</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300 font-normal">Standar Mutu Pelayanan Tertinggi</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight mb-6">
            {settings.heroHeadline}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            {settings.heroSubheadline}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Buat Janji Temu Dokter</span>
            </button>
            <a
              href="#layanan"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-colors"
            >
              <span>Katalog Layanan Medis</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </a>
          </div>

          {/* Micro trust indicators (Quiet Unboxed Text with Separators) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>UGD & Farmasi 24 Jam</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Dokter Spesialis Tersertifikasi</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span>Hasil Lab Instan & Akurat</span>
            </div>
          </div>
        </div>

        {/* Quick Doctor / Specialization Search Dock */}
        <div className="mt-12 bg-white rounded-xl shadow-xl p-4 sm:p-5 text-slate-900 border border-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-700" />
              <span>Pencarian Cepat Dokter & Poliklinik</span>
            </h2>
            <span className="text-xs text-slate-600 hidden sm:inline">
              Temukan jadwal dokter sesuai kebutuhan Anda
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Input Nama Dokter / Keluhan */}
            <div className="sm:col-span-4">
              <label htmlFor="search-doctor" className="sr-only">Nama Dokter atau Kata Kunci</label>
              <input
                id="search-doctor"
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Cari nama dokter atau keluhan..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 placeholder:text-slate-600"
              />
            </div>

            {/* Select Spesialisasi */}
            <div className="sm:col-span-3">
              <label htmlFor="select-spec" className="sr-only">Pilih Spesialisasi</label>
              <select
                id="select-spec"
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-800"
              >
                <option value="">Semua Spesialisasi</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Select Hari Praktik */}
            <div className="sm:col-span-3">
              <label htmlFor="select-day" className="sr-only">Pilih Hari Praktik</label>
              <select
                id="select-day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-800"
              >
                <option value="">Semua Hari Praktik</option>
                {days.filter(d => !d.includes('Semina')).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Dokter</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
