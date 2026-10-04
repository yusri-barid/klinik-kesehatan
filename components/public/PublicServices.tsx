'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { ServiceCategory } from '@/types/clinic';
import { formatRupiah } from '@/lib/storage';
import { 
  Stethoscope, 
  Activity, 
  Baby, 
  HeartPulse, 
  Smile, 
  Microscope, 
  Scan, 
  ClipboardCheck, 
  Ambulance, 
  Pill,
  Clock,
  User,
  ArrowRight,
  Check
} from 'lucide-react';

export default function PublicServices() {
  const { services, openBookingModal } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Poliklinik Umum', 'Dokter Spesialis', 'Diagnostik & Lab', 'Layanan Khusus'];

  const filteredServices = selectedCategory === 'Semua'
    ? services.filter(s => s.isAvailable)
    : services.filter(s => s.isAvailable && s.category === selectedCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-teal-700" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-700" />;
      case 'Baby': return <Baby className="w-5 h-5 text-teal-700" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-teal-700" />;
      case 'Smile': return <Smile className="w-5 h-5 text-teal-700" />;
      case 'Microscope': return <Microscope className="w-5 h-5 text-teal-700" />;
      case 'Scan': return <Scan className="w-5 h-5 text-teal-700" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-5 h-5 text-teal-700" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5 text-teal-700" />;
      case 'Pill': return <Pill className="w-5 h-5 text-teal-700" />;
      default: return <Stethoscope className="w-5 h-5 text-teal-700" />;
    }
  };

  return (
    <section id="layanan" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
              Katalog Layanan Medis
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Pilihan Layanan Poliklinik & Diagnostik Terpadu
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Tarif transparan tanpa biaya tersembunyi. Dikelola langsung oleh dokter spesialis dan paramedis berpengalaman.
          </p>
        </div>

        {/* Interactive Category Filter Tabs (Compliant with frontend_design) */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-700/50 hover:shadow-md transition-all flex flex-col justify-between p-6 group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    {getServiceIcon(service.iconName)}
                  </div>
                  
                  {/* Clean unboxed category label */}
                  <span className="text-xs font-medium text-slate-500">
                    {service.category}
                  </span>
                </div>

                {/* Service Name */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Key Features */}
                <ul className="space-y-1.5 mb-6 text-xs text-slate-600">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer: Price, Duration & CTA */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate max-w-[150px]">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{service.doctorInCharge}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-600 tracking-wider">
                      Mulai Dari
                    </span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">
                      {formatRupiah(service.priceMin)}
                    </span>
                    {service.priceMax && (
                      <span className="text-xs text-slate-600 ml-1">
                        - {formatRupiah(service.priceMax)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openBookingModal(undefined, service.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Daftar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
