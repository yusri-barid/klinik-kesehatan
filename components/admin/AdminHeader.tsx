'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { UserRole } from '@/types/clinic';
import { 
  Shield, 
  User, 
  ExternalLink, 
  LogOut, 
  Repeat,
  CheckCircle2,
  Building
} from 'lucide-react';

export default function AdminHeader() {
  const { 
    settings, 
    currentUser, 
    logoutAdmin, 
    switchUserRole, 
    setActiveView, 
    adminTab 
  } = useClinic();

  const getTabTitle = () => {
    switch (adminTab) {
      case 'overview': return 'Ringkasan Dashboard';
      case 'appointments': return 'Manajemen Janji Temu';
      case 'doctors': return 'Manajemen Dokter & Jadwal';
      case 'services': return 'Manajemen Layanan & Tarif';
      case 'facilities': return 'Manajemen Fasilitas Klinik';
      case 'articles': return 'Manajemen Artikel Edukasi';
      case 'settings': return 'Pengaturan Umum & Banner';
      default: return 'CMS Portal';
    }
  };

  const handleRoleToggle = () => {
    if (!currentUser) return;
    const nextRole: UserRole = currentUser.role === 'Super Admin' ? 'Content Editor' : 'Super Admin';
    switchUserRole(nextRole);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 truncate">
        <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
          <Building className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{settings.clinicName} CMS</span>
        </span>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium truncate">{getTabTitle()}</span>
      </div>

      {/* User Controls & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Role Badge & Switcher for Demo testing */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            {currentUser?.role === 'Super Admin' ? (
              <Shield className="w-3.5 h-3.5 text-teal-700" />
            ) : (
              <User className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="font-semibold">{currentUser?.fullName}</span>
            <span className="text-[11px] text-slate-500">({currentUser?.role})</span>
          </div>

          <button
            onClick={handleRoleToggle}
            className="ml-2 text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            title="Klik untuk beralih antara Super Admin & Content Editor"
          >
            <Repeat className="w-3 h-3" />
            <span>Ganti Role</span>
          </button>
        </div>

        {/* View Public Web button */}
        <button
          onClick={() => setActiveView('public')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Buka Website Pasien"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Website Pasien</span>
        </button>

        {/* Logout */}
        <button
          onClick={logoutAdmin}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Keluar dari CMS"
          aria-label="Keluar dari CMS"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>

    </header>
  );
}
