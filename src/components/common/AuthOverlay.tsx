/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  LogIn, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Compass, 
  Loader2, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SYSTEM_ROLES } from '../../constants';
import { motion, AnimatePresence } from 'motion/react';

export const AuthOverlay: React.FC = () => {
  const { user, login, register, loginWithGoogle, resetPassword, loading } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(true);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PUBLIC_USER);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dusunId, setDusunId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // List of pre-seeded accounts for 1-click demonstration
  const quickAccounts = [
    { name: 'Ir. H. Suparman', role: UserRole.VILLAGE_HEAD, email: 'kades.srimulyo@easydes.id', desc: 'Kepala Desa - Akses penuh kebijakan & persetujuan digital' },
    { name: 'Budi Setiawan, S.IP', role: UserRole.SECRETARY, email: 'sekdes.srimulyo@easydes.id', desc: 'Sekretaris Desa - Otoritas tata usaha & tanda tangan surat' },
    { name: 'Siti Rahmawati, A.Md', role: UserRole.TREASURER, email: 'bendahara.srimulyo@easydes.id', desc: 'Kaur Keuangan - Manajemen anggaran APBDes & keuangan' },
    { name: 'Andi Wijaya', role: UserRole.ADMIN, email: 'admin.srimulyo@easydes.id', desc: 'Super Admin - Pengendali penuh basis data & setelan sistem' },
    { name: 'Eko Prasetyo', role: UserRole.OPERATOR, email: 'operator.srimulyo@easydes.id', desc: 'Operator CC - Input data harian & monitoring cctv terpadu' },
    { name: 'Hendra Saputra', role: UserRole.HAMLET_HEAD, email: 'kadus.krajan@easydes.id', desc: 'Kadus Krajan - Pemantauan wilayah & aduan dusun setempat' },
    { name: 'Rian Hidayat', role: UserRole.TAX_COLLECTOR, email: 'kolektor.pbb@easydes.id', desc: 'Kolektor PBB - Pemungutan pajak bumi bangunan & peta warga' },
    { name: 'Warga Mandiri', role: UserRole.PUBLIC_USER, email: 'warga.mandiri@easydes.id', desc: 'Masyarakat / Publik - Layanan surat mandiri & ajukan aduan' }
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    if (!email || !password) {
      setError('Mohon isi seluruh field email dan kata sandi.');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Silakan periksa kembali kredensial Anda.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password || !fullName) {
      setError('Mohon isi field Nama Lengkap, Email, dan Kata Sandi.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal berisi 6 karakter.');
      return;
    }

    try {
      await register(email, password, fullName, role, {
        phoneNumber: phoneNumber || undefined,
        dusunId: dusunId || undefined
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email) {
      setError('Masukkan alamat email Anda terlebih dahulu.');
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMsg('Email instruksi atur ulang kata sandi berhasil dikirim.');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email atur ulang.');
    }
  };

  const triggerQuickLogin = async (accountEmail: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await login(accountEmail, 'password123'); // Preset password for mock users
    } catch (err: any) {
      setError(err.message);
    }
  };

  // If user is already authenticated, don't show the gate
  if (user) return null;

  return (
    <div id="auth_portal_overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/80 dark:bg-zinc-950/90 backdrop-blur-lg p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh] md:h-[620px]">
        
        {/* Left Side Banner: Information and Branding */}
        <div className="md:w-[42%] bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background lights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-xl -ml-16 -mb-16 pointer-events-none" />

          {/* Top Branding Section */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-max border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">EasyDes Command Center</span>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight mt-6 leading-tight">
              Sistem Terpadu Pemerintah Desa
            </h2>
            <p className="text-zinc-200 text-xs mt-2.5 leading-relaxed font-sans">
              Portal otentikasi aman untuk aparatur, staf dusun, pengumpul PBB, dan masyarakat mandiri Desa Bongas Kulon.
            </p>
          </div>

          {/* Bottom Metainfo */}
          <div className="mt-12 md:mt-0 relative z-10 border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block font-mono">Kode Wilayah</span>
                <span className="text-xs font-semibold block mt-0.5">32.10.14.2005</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block font-mono">Kecamatan</span>
                <span className="text-xs font-semibold block mt-0.5">Sumberjaya</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block font-mono">Kabupaten</span>
                <span className="text-xs font-semibold block mt-0.5">Majalengka, Jabar</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block font-mono">Pencegahan</span>
                <span className="text-xs font-semibold block mt-0.5 text-emerald-300">ISO 27001 Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Work Area: Login/Register Forms & 1-Click presets */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header tabs for toggling forms */}
          <div className="flex border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-6 pt-3 flex-shrink-0">
            <button 
              onClick={() => { setIsRegistering(false); setShowForgot(false); }}
              className={`pb-3 text-xs font-bold transition-all px-4 border-b-2 -mb-[1px] ${!isRegistering && !showForgot ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-black' : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'}`}
            >
              Sign In Akun
            </button>
            <button 
              onClick={() => { setIsRegistering(true); setShowForgot(false); }}
              className={`pb-3 text-xs font-bold transition-all px-4 border-b-2 -mb-[1px] ${isRegistering && !showForgot ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-black' : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'}`}
            >
              Registrasi Warga
            </button>
            
            {/* Quick Demo toggle button */}
            <button
              onClick={() => setShowQuickLogin(!showQuickLogin)}
              className="ml-auto pb-3 text-[10px] font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 px-3"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showQuickLogin ? 'Sembunyikan Demo' : '1-Click Login Demo'}</span>
            </button>
          </div>

          {/* Form Scrollable container */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between custom-scrollbar">
            
            <div className="space-y-4">
              
              {/* Alert Notifications */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium"
                  >
                    {error}
                  </motion.div>
                )}
                
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium"
                  >
                    {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DYNAMIC VIEW FOR FORMS OR QUICK PRESET GRIDS */}
              {showQuickLogin ? (
                // 1-Click Preset login board (makes testing and validation extreme breeze)
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Presensi & Akses Peran (1-Click Demo)
                    </h3>
                    <span className="text-[10px] text-zinc-400">Password: password123</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {quickAccounts.map((acc, idx) => {
                      const colorInfo = SYSTEM_ROLES.find(r => r.role === acc.role);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => triggerQuickLogin(acc.email)}
                          disabled={loading}
                          className="flex flex-col text-left p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-zinc-50 hover:bg-indigo-50/40 dark:bg-zinc-900/40 dark:hover:bg-indigo-950/20 transition-all group hover:border-indigo-400/50 disabled:opacity-50"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{acc.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${colorInfo?.color || 'border-zinc-200 text-zinc-500'}`}>
                              {acc.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 leading-normal">{acc.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : showForgot ? (
                // Password Reset Screen
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Email Pemulihan Sesi</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email"
                        placeholder="contoh@easydes.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim Link Pengaturan Ulang'}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setShowForgot(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 block text-center w-full"
                  >
                    Kembali ke Login
                  </button>
                </form>
              ) : isRegistering ? (
                // Registration Form
                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Nama Lengkap</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Alamat Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email"
                        placeholder="email@easydes.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Kata Sandi (Min 6 Karakter)</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Nomor Telepon (Optional)</label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="tel"
                        placeholder="0812xxxxxx"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Peran Akun</label>
                    <div className="relative flex items-center">
                      <ShieldCheck className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value={UserRole.PUBLIC_USER}>Public (Masyarakat / Warga)</option>
                        <option value={UserRole.TAX_COLLECTOR}>Kolektor Pajak PBB</option>
                        <option value={UserRole.HAMLET_HEAD}>Kadus (Kepala Dusun)</option>
                        <option value={UserRole.KASI_KESEJAHTERAAN}>Kasi Kesejahteraan</option>
                        <option value={UserRole.KASI_PELAYANAN}>Kasi Pelayanan</option>
                        <option value={UserRole.KASI_PEMERINTAHAN}>Kasi Pemerintahan</option>
                      </select>
                    </div>
                  </div>

                  {/* Hamlet/Dusun Residence */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Wilayah Dusun (Optional)</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <select
                        value={dusunId}
                        onChange={(e) => setDusunId(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">Pilih Dusun Domisili</option>
                        <option value="dusun_01">Blok Sabtu</option>
                        <option value="dusun_02">Blok Selasa</option>
                        <option value="dusun_03">Blok Rabu</option>
                        <option value="dusun_04">Blok Karang Kencana</option>
                      </select>
                    </div>
                  </div>

                  {/* Register Button */}
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Selesaikan Registrasi Warga'}
                    </button>
                  </div>
                </form>
              ) : (
                // Traditional Email Login Form
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Alamat Email Terdaftar</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email"
                        placeholder="contoh@easydes.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Kata Sandi</label>
                      <button 
                        type="button" 
                        onClick={() => setShowForgot(true)}
                        className="text-[10px] text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                      >
                        Lupa Sandi?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-zinc-400" />
                      <input 
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Aplikasi'}
                  </button>
                </form>
              )}

              {/* Provider Separator if not showing demo preset and not in Forgot Screen */}
              {!showForgot && !showQuickLogin && (
                <div className="relative my-4 flex-shrink-0">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold">
                    <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400">Atau Autentikasi Alternatif</span>
                  </div>
                </div>
              )}

              {/* Google Sign-In Integration */}
              {!showForgot && !showQuickLogin && (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 font-bold text-xs py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.24-3.118C18.281 1.934 15.531 1 12.24 1 5.926 1 1 5.925 1 12s4.926 11 11.24 11c6.578 0 10.953-4.63 10.953-11.143 0-.748-.08-1.32-.176-1.571h-10.777z"/>
                  </svg>
                  <span>Masuk dengan Akun Google</span>
                </button>
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex-shrink-0 mt-4">
              <span>Sistem Manajemen Keamanan Informasi Desa (SMKID)</span>
              <span className="mt-1 sm:mt-0 flex items-center gap-1">
                <Compass className="w-3 h-3 text-indigo-500 animate-spin-slow" /> v3.0.2 - Bongas Kulon Smart Village
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
