'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  UserRoundCheck, 
  Stethoscope, 
  Building2, 
  FileText, 
  SlidersHorizontal,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

export default function AdminSidebar() {
  const { adminTab, setAdminTab, setActiveView, appointments, currentUser } = useClinic();

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  const menuItems = [
    {
      id: 'overview',
      label: 'Ringkasan Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
      allowed: true,
    },
    {
      id: 'appointments',
      label: 'Janji Temu Pasien',
      icon: <CalendarClock className="w-4 h-4" />,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
      allowed: true, // visible to all, actions restricted
    },
    {
      id: 'doctors',
      label: 'Dokter & Jadwal',
      icon: <UserRoundCheck className="w-4 h-4" />,
      badge: null,
      allowed: true,
    },
    {
      id: 'services',
      label: 'Layanan Medis & Tarif',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: null,
      allowed: true,
    },
    {
      id: 'facilities',
      label: 'Fasilitas Klinik',
      icon: <Building2 className="w-4 h-4" />,
      badge: null,
      allowed: true,
    },
    {
      id: 'articles',
      label: 'Artikel Edukasi (Blog)',
      icon: <FileText className="w-4 h-4" />,
      badge: null,
      allowed: true,
    },
    {
      id: 'settings',
      label: 'Pengaturan & Banner',
      icon: <SlidersHorizontal className="w-4 h-4" />,
      badge: !isSuperAdmin ? 'Kunci' : null,
      allowed: true,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-57px)] border-r border-slate-800">
      
      {/* Clinic Brand in CMS */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-white block truncate">
              Klinik Medika Sehat
            </span>
            <span className="text-[10px] text-teal-400 font-medium block uppercase tracking-wider">
              Web Admin CMS
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3 flex-1 space-y-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
          Menu Manajemen
        </div>

        {menuItems.map((item) => {
          const isActive = adminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-white text-teal-900'
                      : item.badge === 'Kunci'
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role notice / status indicator */}
      {!isSuperAdmin && (
        <div className="m-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mode Content Editor</span>
          </div>
          <span>Akses edit dibatasi pada konten artikel, layanan & fasilitas.</span>
        </div>
      )}

      {/* Back to Public Web */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => setActiveView('public')}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Web Publik</span>
        </button>
      </div>

    </aside>
  );
}
