'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Appointment } from '@/types/clinic';
import { Search, X, CheckCircle, Clock, XCircle, Calendar, User, Phone, AlertCircle } from 'lucide-react';

export default function PublicTrackBookingModal() {
  const { isTrackModalOpen, closeTrackModal, findAppointmentByCodeOrPhone, showToast } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Appointment[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Masukkan kode booking atau nomor WhatsApp Anda.');
      return;
    }
    const results = findAppointmentByCodeOrPhone(searchQuery.trim());
    setSearchResults(results);
    setHasSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Terkonfirmasi</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Konfirmasi Staf</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Selesai Konsultasi</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
            <XCircle className="w-3.5 h-3.5" />
            <span>Dibatalkan</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={closeTrackModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          aria-label="Tutup pencarian status"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-700" />
            <span>Cek Status Janji Temu Pasien</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status verifikasi jadwal dokter dan nomor antrean Anda secara mandiri.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan Kode Booking (e.g. MED-749201) / No. WA..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
            >
              Cari
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Tips: Coba cari contoh kode demo: <strong>MED-749201</strong> atau <strong>MED-749202</strong>
          </span>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Kode Booking</span>
                      <div className="font-mono font-bold text-sm text-teal-800">{apt.bookingCode}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Status Pendaftaran</span>
                      <div>{getStatusBadge(apt.status)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Nama Pasien:</span>
                      <strong>{apt.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Nomor Antrean:</span>
                      <strong className="text-slate-900 font-mono text-sm">#{apt.queueNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Dokter Pemeriksa:</span>
                      <span>{apt.doctorName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Jadwal Kunjungan:</span>
                      <span className="font-mono">{apt.appointmentDate} · {apt.appointmentTimeSlot} WIB</span>
                    </div>
                  </div>

                  {apt.adminNotes && (
                    <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                      <strong>Catatan Petugas Klinik:</strong> {apt.adminNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Layanan: {apt.serviceName}</span>
                    <span>Jenis: {apt.visitType}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-800">
                  Data janji temu tidak ditemukan
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pastikan kode booking atau nomor WhatsApp yang Anda masukkan sesuai dengan data saat pendaftaran.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
