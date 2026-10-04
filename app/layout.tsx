import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Klinik Medika Sehat | Layanan Kesehatan Terpercaya & Booking Online',
  description: 'Website resmi Klinik Medika Sehat. Menyediakan layanan poliklinik umum, dokter spesialis, laboratorium 24 jam, dan pendaftaran janji temu pasien secara online.',
  keywords: [
    'klinik kesehatan jakarta',
    'klinik medika sehat',
    'jadwal dokter spesialis',
    'booking dokter online',
    'laboratorium 24 jam',
    'poliklinik anak',
    'penyakit dalam'
  ],
  authors: [{ name: 'Klinik Medika Sehat' }],
  openGraph: {
    title: 'Klinik Medika Sehat | Layanan Kesehatan Terpercaya & Booking Online',
    description: 'Pelayanan medis terpadu dan profesional dengan dokter spesialis berpengalaman, fasilitas modern, dan kemudahan booking jadwal praktik online.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Klinik Medika Sehat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Klinik Medika Sehat | Layanan Medis & Booking Online',
    description: 'Layanan medis terpercaya dengan akreditasi Kemenkes RI. Jadwal dokter dan booking janji temu mudah secara online.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: 'Klinik Medika Sehat',
  description: 'Klinik Pratama & Utama dengan pelayanan medis terpadu dan fasilitas diagnostik terakreditasi Paripurna Kemenkes RI.',
  telephone: '+62-21-3928899',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Boulevard Medika No. 88, Menteng',
    addressLocality: 'Jakarta Pusat',
    addressRegion: 'DKI Jakarta',
    postalCode: '10310',
    addressCountry: 'ID',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '08:00',
      closes: '16:00',
    }
  ],
  medicalSpecialty: [
    'GeneralPractice',
    'Pediatrics',
    'InternalMedicine',
    'Obstetrics',
    'Dentistry'
  ],
  isAcceptingNewPatients: true,
  priceRange: '$$',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-slate-800 bg-slate-50 selection:bg-teal-700 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
