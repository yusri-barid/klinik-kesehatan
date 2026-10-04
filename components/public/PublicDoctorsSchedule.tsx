'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { Doctor } from '@/types/clinic';
import { formatRupiah } from '@/lib/storage';
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Search, 
  UserRound,
  FileBadge
} from 'lucide-react';

interface PublicDoctorsScheduleProps {
  initialSearchName?: string;
  initialSpecialization?: string;
  initialDay?: string;
}

export default function PublicDoctorsSchedule({
  initialSearchName = '',
  initialSpecialization = '',
  initialDay = '',
}: PublicDoctorsScheduleProps) {
  const { doctors, openBookingModal } = useClinic();

  const [searchQuery, setSearchQuery] = useState(initialSearchName);
  const [selectedSpec, setSelectedSpec] = useState(initialSpecialization);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);

  const specializations = ['Semua Spesialisasi', ...Array.from(new Set(doctors.map((d) => d.specialization)))];
  const daysList = ['Semua Hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Filtering logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchName = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSpec = selectedSpec === 'Semua Spesialisasi' || selectedSpec === '' || doc.specialization === selectedSpec;
    const matchDay = selectedDay === 'Semua Hari' || selectedDay === '' || doc.daysActive.includes(selectedDay);
    return matchName && matchSpec && matchDay;
  });

  return (
    <section id="dokter" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            Tim Medis & Jadwal Praktik
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Dokter Spesialis & Umum Berlisensi Resmi
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pilih dokter dan periksa hari serta jam praktik yang sesuai dengan waktu luang Anda. Seluruh dokter memiliki Surat Izin Praktik (SIP) resmi Dinkes DKI Jakarta.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="search-doctor-input" className="sr-only">Cari dokter</label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="search-doctor-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama dokter atau gelar..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900 placeholder:text-slate-500"
              />
            </div>

            {/* Spec Dropdown */}
            <div>
              <label htmlFor="select-doctor-spec" className="sr-only">Pilih Spesialisasi</label>
              <select
                id="select-doctor-spec"
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec === 'Semua Spesialisasi' ? '' : spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Dropdown */}
            <div>
              <label htmlFor="select-doctor-day" className="sr-only">Pilih Hari Praktik</label>
              <select
                id="select-doctor-day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white text-slate-900"
              >
                {daysList.map((day) => (
                  <option key={day} value={day === 'Semua Hari' ? '' : day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchQuery || selectedSpec || selectedDay) && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan {filteredDoctors.length} dari {doctors.length} dokter</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpec('');
                  setSelectedDay('');
                }}
                className="text-teal-700 hover:underline font-medium cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <UserRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Tidak ada dokter yang cocok
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Coba sesuaikan kata kunci pencarian atau ubah filter hari praktik Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpec('');
                setSelectedDay('');
              }}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              Tampilkan Semua Dokter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Doctor Info Lockup */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                      <Image
                        src={doc.avatarUrl}
                        alt={doc.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Quiet unboxed status */}
                      <div className="flex items-center gap-1.5 text-xs mb-1">
                        {doc.isLeave ? (
                          <span className="text-rose-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Sedang Cuti</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Praktik Aktif</span>
                          </span>
                        )}
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500 truncate">{doc.experienceYears} th pengalaman</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-teal-700 font-medium truncate">
                        {doc.title}
                      </p>
                    </div>
                  </div>

                  {/* Operational Schedule Block */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Hari: {doc.daysActive.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Jam: {doc.hoursText}</span>
                    </div>
                  </div>

                  {/* Consultation Fee & SIP */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                    <span className="text-slate-500">Tarif Konsultasi:</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatRupiah(doc.consultationFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>No. SIP:</span>
                    <span className="font-mono">{doc.sip}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoctorForModal(doc)}
                    className="flex-1 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Profil Dokter
                  </button>
                  <button
                    disabled={doc.isLeave}
                    onClick={() => openBookingModal(doc.id)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      doc.isLeave
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                    }`}
                  >
                    {doc.isLeave ? 'Sedang Cuti' : 'Pilih Jadwal'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Doctor Profile Details Modal */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedDoctorForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                <Image
                  src={selectedDoctorForModal.avatarUrl}
                  alt={selectedDoctorForModal.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
                  {selectedDoctorForModal.specialization}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedDoctorForModal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Surat Izin Praktik (SIP): <span className="font-mono text-slate-700">{selectedDoctorForModal.sip}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 mb-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-teal-700" />
                  <span>Riwayat Pendidikan & Almamater</span>
                </h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedDoctorForModal.education}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-700" />
                  <span>Biografi & Keahlian Medis</span>
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedDoctorForModal.bio}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>Jadwal Praktik Rutin</span>
                </h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div><strong>Hari:</strong> {selectedDoctorForModal.daysActive.join(', ')}</div>
                  <div><strong>Waktu:</strong> {selectedDoctorForModal.hoursText}</div>
                  <div><strong>Slot Kunjungan:</strong> {selectedDoctorForModal.timeSlots.join(' · ')}</div>
                  <div><strong>Biaya Konsultasi:</strong> {formatRupiah(selectedDoctorForModal.consultationFee)}</div>
                </div>
              </div>

              {selectedDoctorForModal.isLeave && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Dokter sedang cuti ({selectedDoctorForModal.leaveReason || 'Cuti tugas'}). Pendaftaran sementara tidak tersedia.</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="flex-1 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup
              </button>
              <button
                disabled={selectedDoctorForModal.isLeave}
                onClick={() => {
                  const docId = selectedDoctorForModal.id;
                  setSelectedDoctorForModal(null);
                  openBookingModal(docId);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  selectedDoctorForModal.isLeave
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
              >
                Buat Janji Temu
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
