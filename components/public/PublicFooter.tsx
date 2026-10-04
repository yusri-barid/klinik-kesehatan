'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { ShieldCheck, Phone, Mail, MapPin, Lock, RotateCcw } from 'lucide-react';

export default function PublicFooter() {
  const { settings, openLoginModal, currentUser, setActiveView, resetAllData } = useClinic();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                M
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                {settings.clinicName}
              </span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {settings.clinicTagline}. Memberikan pelayanan kesehatan menyeluruh bagi keluarga dengan standar operasional medis tertinggi di Indonesia.
            </p>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div>{settings.skKemenkes}</div>
              <div className="text-teal-400">{settings.accreditationText}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#layanan" className="hover:text-white transition-colors">Poli Umum</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Poli Spesialis Anak</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Penyakit Dalam (Internist)</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Kebidanan & Kandungan</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Laboratorium 24 Jam</a></li>
            </ul>
          </div>

          {/* Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigasi Pasien
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#tentang" className="hover:text-white transition-colors">Visi & Misi</a></li>
              <li><a href="#dokter" className="hover:text-white transition-colors">Jadwal Dokter</a></li>
              <li><a href="#fasilitas" className="hover:text-white transition-colors">Fasilitas Diagnostik</a></li>
              <li><a href="#artikel" className="hover:text-white transition-colors">Edukasi Kesehatan</a></li>
              <li><a href="#kontak" className="hover:text-white transition-colors">Peta & Kontak</a></li>
            </ul>
          </div>

          {/* Emergency & Staff Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Bantuan & Staf
            </h4>
            <div className="space-y-2 text-xs">
              <div className="text-rose-400 font-semibold">
                UGD 24 Jam: {settings.phoneEmergency}
              </div>
              <div>Resepsionis: {settings.phoneReception}</div>
              <div>WA CS: +{settings.whatsapp}</div>
            </div>

            <div className="pt-2">
              {currentUser ? (
                <button
                  onClick={() => setActiveView('admin')}
                  className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dashboard Admin CMS</span>
                </button>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Portal Staf Medis & Admin</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {settings.clinicName}. Hak Cipta Dilindungi Undang-Undang Republik Indonesia.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('Kembalikan seluruh data dan artikel demo ke pengaturan awal?')) {
                  resetAllData();
                }
              }}
              className="text-slate-500 hover:text-slate-400 flex items-center gap-1 cursor-pointer"
              title="Reset data demo lokal"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Demo</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Versi 1.0 (MVP Company Profile & CMS)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
