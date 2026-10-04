'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { UserRole } from '@/types/clinic';
import { X, Lock, Shield, User, Key, Check } from 'lucide-react';

export default function AdminLoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginAsAdmin, showToast } = useClinic();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin(selectedRole);
  };

  const handleQuickDemoSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Super Admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('editor');
      setPassword('editor123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          aria-label="Tutup form login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Login CMS Admin Klinik
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Masuk ke panel manajemen konten dan janji temu pasien
          </p>
        </div>

        {/* Quick Role Switcher for Evaluator/Tester */}
        <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="block text-[11px] font-semibold text-slate-600 mb-2">
            Pilih Role Akun Demo:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSelect('Super Admin')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                selectedRole === 'Super Admin'
                  ? 'bg-white border-teal-700 text-teal-900 shadow-sm font-semibold'
                  : 'bg-transparent border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-700" />
                <span>Super Admin</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                Akses Penuh Semua Modul
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoSelect('Content Editor')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                selectedRole === 'Content Editor'
                  ? 'bg-white border-teal-700 text-teal-900 shadow-sm font-semibold'
                  : 'bg-transparent border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-700" />
                <span>Content Editor</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                Kelola Artikel & Layanan
              </span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Masuk sebagai {selectedRole}
          </button>
        </form>

      </div>
    </div>
  );
}
