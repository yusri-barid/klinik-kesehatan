'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminDashboardOverview from './AdminDashboardOverview';
import AdminAppointments from './AdminAppointments';
import AdminDoctors from './AdminDoctors';
import AdminServices from './AdminServices';
import AdminFacilities from './AdminFacilities';
import AdminArticles from './AdminArticles';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  const { adminTab } = useClinic();

  const renderContent = () => {
    switch (adminTab) {
      case 'overview':
        return <AdminDashboardOverview />;
      case 'appointments':
        return <AdminAppointments />;
      case 'doctors':
        return <AdminDoctors />;
      case 'services':
        return <AdminServices />;
      case 'facilities':
        return <AdminFacilities />;
      case 'articles':
        return <AdminArticles />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminHeader />
      <div className="flex-1 flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
