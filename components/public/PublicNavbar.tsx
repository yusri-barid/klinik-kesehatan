'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Phone, Calendar, Search, ShieldCheck, Menu, X, Lock } from 'lucide-react';

export default function PublicNavbar() {
  const { settings, openBookingModal, openTrackModal, openLoginModal, currentUser, setActiveView } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang Kami', href: '#tentang' },
    { label: 'Layanan Medis', href: '#layanan' },
    { label: 'Dokter & Jadwal', href: '#dokter' },
    { label: 'Fasilitas', href: '#fasilitas' },
    { label: 'Artikel Kesehatan', href: '#artikel' },
    { label: 'Kontak', href: '#kontak' },
  ];

  return (
    <>
      {/* Top Clinical Announcement Bar */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 shrink-0" />
              <span className="truncate">{settings.announcementText}</span>
            </div>
            <div className="hidden md:flex items-center gap-6 shrink-0 text-slate-300">
              <a href={`tel:${settings.phoneEmergency.replace(/\D/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>UGD 24 Jam: <strong className="text-white font-mono">{settings.phoneEmergency}</strong></span>
              </a>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 text-[11px]">{settings.accreditationText}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar strictly obeying Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single element wordmark */}
          <a href="#beranda" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              <span className="text-white font-semibold">M</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                {settings.clinicName}
              </span>
              <span className="text-[11px] font-medium text-teal-800 tracking-wider uppercase block">
                Pratama & Utama
              </span>
            </div>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-teal-700 transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-teal-700"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Track appointment status button */}
            <button
              onClick={openTrackModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Cek jadwal dan antrean pendaftaran Anda"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Cek Status Booking</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Buat Janji Temu</span>
            </button>

            {/* CMS Portal Trigger */}
            {currentUser ? (
              <button
                onClick={() => setActiveView('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                title="Buka CMS Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Admin CMS</span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Login Staf / Admin CMS"
                aria-label="Login Staf Medis"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => openBookingModal()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 rounded-lg"
            >
              Booking
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-700"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openTrackModal();
                }}
                className="w-full text-left py-2 text-sm font-medium text-slate-600 flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Cek Status Pendaftaran Pasien</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) {
                    setActiveView('admin');
                  } else {
                    openLoginModal();
                  }
                }}
                className="w-full text-left py-2 text-sm font-medium text-teal-800 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-teal-600" />
                <span>{currentUser ? 'Kembali ke CMS Admin' : 'Login Staf Medis / Admin CMS'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
