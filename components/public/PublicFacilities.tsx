'use client';

import React from 'react';
import Image from 'next/image';
import { useClinic } from '@/context/ClinicContext';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function PublicFacilities() {
  const { facilities } = useClinic();

  return (
    <section id="fasilitas" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>Fasilitas & Penunjang Medis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Infrastruktur Medis Modern untuk Kenyamanan & Akurasi Pasien
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Didukung sarana diagnostik mutakhir dan ruangan steril berstandar rumah sakit guna menjamin keselamatan dan kepuasan Anda sekeluarga.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Facility Image with measured aspect ratio and CSS Fallback */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={fac.imageUrl}
                  alt={fac.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium tracking-wide">
                  {fac.category}
                </div>
              </div>

              {/* Facility Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {fac.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {fac.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-900 block mb-2">
                    Spesifikasi & Standar Fasilitas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fac.specifications.map((spec, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span className="leading-tight">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
