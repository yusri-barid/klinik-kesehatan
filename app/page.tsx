'use client';

import React, { useState } from 'react';
import { ClinicProvider, useClinic } from '@/context/ClinicContext';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicHero from '@/components/public/PublicHero';
import PublicStatsAndAccreditation from '@/components/public/PublicStatsAndAccreditation';
import PublicServices from '@/components/public/PublicServices';
import PublicDoctorsSchedule from '@/components/public/PublicDoctorsSchedule';
import PublicFacilities from '@/components/public/PublicFacilities';
import PublicArticles from '@/components/public/PublicArticles';
import PublicContactAndLocation from '@/components/public/PublicContactAndLocation';
import PublicFooter from '@/components/public/PublicFooter';
import PublicBookingModal from '@/components/public/PublicBookingModal';
import PublicTrackBookingModal from '@/components/public/PublicTrackBookingModal';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { CheckCircle2 } from 'lucide-react';

function ClinicAppContent() {
  const { activeView, toastMessage } = useClinic();

  // Search parameters passed from Hero to Doctor Schedule
  const [heroSearchName, setHeroSearchName] = useState('');
  const [heroSpecialization, setHeroSpecialization] = useState('');
  const [heroDay, setHeroDay] = useState('');

  const handleHeroDoctorSearch = (name: string, spec: string, day: string) => {
    setHeroSearchName(name);
    setHeroSpecialization(spec);
    setHeroDay(day);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-800">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* View Switcher: Public Website vs CMS Admin */}
      {activeView === 'admin' ? (
        <AdminDashboard />
      ) : (
        <div className="flex flex-col min-h-screen">
          <PublicNavbar />
          <main className="flex-1">
            <PublicHero onSearchDoctors={handleHeroDoctorSearch} />
            <PublicStatsAndAccreditation />
            <PublicServices />
            <PublicDoctorsSchedule
              key={`${heroSearchName}-${heroSpecialization}-${heroDay}`}
              initialSearchName={heroSearchName}
              initialSpecialization={heroSpecialization}
              initialDay={heroDay}
            />
            <PublicFacilities />
            <PublicArticles />
            <PublicContactAndLocation />
          </main>
          <PublicFooter />
        </div>
      )}

      {/* Global Interactive Modals */}
      <PublicBookingModal />
      <PublicTrackBookingModal />
      <AdminLoginModal />

    </div>
  );
}

export default function HomePage() {
  return (
    <ClinicProvider>
      <ClinicAppContent />
    </ClinicProvider>
  );
}
