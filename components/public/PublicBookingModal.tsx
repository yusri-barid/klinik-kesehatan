'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Appointment } from '@/types/clinic';
import { formatRupiah, buildWhatsAppMessageUrl } from '@/lib/storage';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  Printer, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

function BookingModalDialog() {
  const {
    closeBookingModal,
    doctors,
    services,
    settings,
    preselectedDoctorId,
    preselectedServiceId,
    createAppointment,
    showToast,
  } = useClinic();

  // Wizard Steps: 1: Layanan & Dokter, 2: Waktu & Tanggal, 3: Data Pasien, 4: Sukses
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields with pure initializers
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    return preselectedServiceId || (services[0]?.id || '');
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(() => {
    return preselectedDoctorId || (doctors[0]?.id || '');
  });
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState<string>(() => {
    const doc = doctors.find((d) => d.id === (preselectedDoctorId || doctors[0]?.id));
    return doc?.timeSlots?.[0] || '09:00';
  });

  // Patient Fields
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientNik, setPatientNik] = useState<string>('');
  const [patientBirthDate, setPatientBirthDate] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'L' | 'P'>('L');
  const [patientAddress, setPatientAddress] = useState<string>('');
  const [visitType, setVisitType] = useState<'Baru' | 'Kontrol'>('Baru');
  const [complaintsNotes, setComplaintsNotes] = useState<string>('');

  // Success State
  const [createdBooking, setCreatedBooking] = useState<{
    appointment: Appointment;
    bookingCode: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const currentService = services.find((s) => s.id === selectedServiceId);

  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find((d) => d.id === docId);
    if (doc && doc.timeSlots.length > 0) {
      setAppointmentTimeSlot(doc.timeSlots[0]);
    }
  };

  const handleNextToStep2 = () => {
    if (!selectedServiceId || !selectedDoctorId) {
      showToast('Pilih layanan dan dokter terlebih dahulu.');
      return;
    }
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!appointmentDate || !appointmentTimeSlot) {
      showToast('Pilih tanggal dan slot waktu kunjungan.');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      showToast('Nama lengkap pasien wajib diisi.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 8) {
      showToast('Nomor WhatsApp aktif wajib diisi dengan benar.');
      return;
    }

    const doc = currentDoctor || doctors[0];
    const srv = currentService || services[0];

    const result = createAppointment({
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim() || '-',
      patientNik: patientNik.trim() || '-',
      patientBirthDate: patientBirthDate || '1990-01-01',
      patientGender,
      patientAddress: patientAddress.trim() || '-',
      visitType,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialization: doc.specialization,
      serviceId: srv.id,
      serviceName: srv.name,
      appointmentDate,
      appointmentTimeSlot,
      complaintsNotes: complaintsNotes.trim() || 'Konsultasi rutin',
    });

    setCreatedBooking(result);
    setStep(4);
    showToast(`Pendaftaran berhasil! Kode Booking: ${result.bookingCode}`);
  };

  const handleCopyCode = (code: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePrintETicket = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pendaftaran Janji Temu Pasien
            </h2>
            <p className="text-xs text-slate-500">
              {settings.clinicName} · Booking Resmi Online
            </p>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            aria-label="Tutup formulir pendaftaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        {step < 4 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className={`font-semibold ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
              1. Layanan & Dokter
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`font-semibold ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
              2. Tanggal & Jam
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`font-semibold ${step >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
              3. Data Pasien
            </span>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Pilih Layanan & Dokter */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Layanan / Poliklinik <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                >
                  {services.filter(s => s.isAvailable).map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} (Mulai {formatRupiah(srv.priceMin)})
                    </option>
                  ))}
                </select>
                {currentService && (
                  <p className="text-xs text-slate-500 mt-1">
                    {currentService.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Dokter Spesialis / Dokter Jaga <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => !doc.isLeave && handleDoctorChange(doc.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          doc.isLeave
                            ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-teal-50 border-teal-700 text-teal-950 font-medium'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{doc.name}</div>
                          <div className="text-slate-500 text-[11px]">
                            {doc.title} · Tarif {formatRupiah(doc.consultationFee)}
                          </div>
                          <div className="text-[11px] text-teal-800 mt-0.5">
                            Praktik: {doc.daysActive.join(', ')} ({doc.hoursText})
                          </div>
                        </div>

                        {doc.isLeave ? (
                          <span className="text-rose-600 font-semibold text-[11px]">
                            Cuti
                          </span>
                        ) : isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextToStep2}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
                >
                  Lanjut: Pilih Waktu
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Tanggal & Slot Jam */}
          {step === 2 && currentDoctor && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                <div><strong>Dokter:</strong> {currentDoctor.name} ({currentDoctor.title})</div>
                <div><strong>Hari Praktik:</strong> {currentDoctor.daysActive.join(', ')}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Tanggal Rencana Kunjungan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Harap memilih hari yang sesuai dengan jadwal aktif dokter ({currentDoctor.daysActive.join(', ')}).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Slot Jam Kunjungan yang Tersedia <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentDoctor.timeSlots.map((slot) => {
                    const isSelected = appointmentTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAppointmentTimeSlot(slot)}
                        className={`py-2 px-3 text-xs rounded-lg border transition-colors cursor-pointer text-center font-mono ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {slot} WIB
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNextToStep3}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
                >
                  Lanjut: Data Pasien
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Formulir Identitas Pasien */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pasien <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Sesuai KTP / Akta"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Konfirmasi booking dikirim ke nomor ini</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Pasien
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="contoh@gmail.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK Pasien (16 digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={patientNik}
                    onChange={(e) => setPatientNik(e.target.value)}
                    placeholder="3171xxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={patientBirthDate}
                    onChange={(e) => setPatientBirthDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as 'L' | 'P')}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kunjungan
                  </label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value as 'Baru' | 'Kontrol')}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  >
                    <option value="Baru">Pasien Baru</option>
                    <option value="Kontrol">Pasien Kontrol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keluhan Singkat / Catatan Medis Awal
                </label>
                <textarea
                  rows={2}
                  value={complaintsNotes}
                  onChange={(e) => setComplaintsNotes(e.target.value)}
                  placeholder="Misal: Demam 2 hari, ingin konsultasi hasil lab, jadwal imunisasi anak..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 resize-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-900">Ringkasan Janji Temu:</div>
                <div className="text-slate-600">
                  {currentDoctor?.name} · {appointmentDate} pk {appointmentTimeSlot} WIB
                </div>
                <div className="text-slate-500 text-[11px]">
                  Estimasi Biaya Konsultasi: {currentDoctor ? formatRupiah(currentDoctor.consultationFee) : '-'} (belum termasuk obat/tindakan)
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
                >
                  Konfirmasi & Daftar Sekarang
                </button>
              </div>

            </form>
          )}

          {/* STEP 4: Bukti Pendaftaran / E-Ticket */}
          {step === 4 && createdBooking && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Pendaftaran Janji Temu Berhasil!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Data Anda telah tersimpan di sistem antrean klinik. Harap simpan Kode Booking di bawah ini.
                </p>
              </div>

              {/* Digital E-Ticket Card */}
              <div id="booking-e-ticket" className="bg-slate-50 rounded-xl p-5 border-2 border-dashed border-teal-600/40 relative">
                
                {/* Code & Queue */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-600 tracking-wider block">
                      Kode Booking Resmi
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold font-mono text-teal-800">
                        {createdBooking.bookingCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(createdBooking.bookingCode)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                        title="Salin Kode Booking"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-600 tracking-wider block">
                      Nomor Antrean
                    </span>
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      #{createdBooking.appointment.queueNumber}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="py-3 space-y-2 text-xs text-slate-700 border-b border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nama Pasien:</span>
                    <strong className="text-slate-900">{createdBooking.appointment.patientName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dokter:</span>
                    <strong className="text-slate-900">{createdBooking.appointment.doctorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Layanan:</span>
                    <span className="text-slate-800">{createdBooking.appointment.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Waktu Kunjungan:</span>
                    <strong className="text-teal-800 font-mono">
                      {createdBooking.appointment.appointmentDate} · {createdBooking.appointment.appointmentTimeSlot} WIB
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">WhatsApp:</span>
                    <span className="font-mono">{createdBooking.appointment.patientPhone}</span>
                  </div>
                </div>

                <div className="pt-3 text-[11px] text-slate-600 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    Mohon hadir 15 menit sebelum waktu konsultasi untuk verifikasi tensi dan berkas di loket pendaftaran.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <a
                  href={buildWhatsAppMessageUrl(createdBooking.appointment, settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Konfirmasi ke WhatsApp Pasien</span>
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrintETicket}
                    className="flex-1 py-2 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak E-Ticket</span>
                  </button>

                  <button
                    onClick={closeBookingModal}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function PublicBookingModal() {
  const { isBookingModalOpen } = useClinic();
  if (!isBookingModalOpen) return null;
  return <BookingModalDialog />;
}
